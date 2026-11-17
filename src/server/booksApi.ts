import { Router, Request, Response } from 'express';
import { Readable } from 'node:stream';
import { GoogleAuth } from 'google-auth-library';
import { adminDb } from './adminDb';
import { requireSuperAdmin, isPremiumActive } from './authMiddleware';

export const booksRouter = Router();

// Books live in a PRIVATE Google Drive folder shared only with the server's service account.
// Students never see a Drive link: the server checks their plan and streams the PDF (with HTTP Range
// support, so a 300 MB book loads page by page instead of all at once).

function driveAuth(): GoogleAuth {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let credentials: any;
  if (raw) {
    try { credentials = JSON.parse(raw); } catch { /* fall back to ADC */ }
  }
  return new GoogleAuth({
    ...(credentials ? { credentials } : {}),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}
const auth = driveAuth();

const FILE_ID_RE = /^[A-Za-z0-9_-]{10,100}$/;
const BOOK_ID_RE = /^[A-Za-z0-9_.-]{1,100}$/;

/** Accepts a bare Drive file id or a full Drive share URL and returns the id. */
export function parseDriveFileId(input: string): string | null {
  const s = String(input || '').trim();
  const m = s.match(/\/d\/([A-Za-z0-9_-]{10,100})/) || s.match(/[?&]id=([A-Za-z0-9_-]{10,100})/);
  const id = m ? m[1] : s;
  return FILE_ID_RE.test(id) ? id : null;
}

// Super admin: link a book id to a Drive file.
booksRouter.post('/admin/map', requireSuperAdmin, async (req: Request, res: Response) => {
  const bookId = String(req.body?.bookId || '');
  const fileId = parseDriveFileId(req.body?.driveFile);
  if (!BOOK_ID_RE.test(bookId) || !fileId) {
    return res.status(400).json({ success: false, error: 'bookId ወይም የ Drive ፋይል ሊንክ ትክክል አይደለም።' });
  }
  await adminDb.collection('book_files').doc(bookId).set({ driveFileId: fileId, updatedBy: req.user!.uid, updatedAt: new Date().toISOString() }, { merge: true });
  res.json({ success: true, bookId });
});

// Super admin: list the PDFs inside a Drive folder (folder must be shared with the service account).
booksRouter.post('/admin/scan', requireSuperAdmin, async (req: Request, res: Response) => {
  const folderId = parseDriveFileId(req.body?.folder);
  if (!folderId) return res.status(400).json({ success: false, error: 'የአቃፊ ሊንክ ትክክል አይደለም።' });
  try {
    const token = await auth.getAccessToken();
    const files: Array<{ id: string; name: string; size?: string }> = [];
    let pageToken = '';
    do {
      const q = encodeURIComponent(`'${folderId}' in parents and mimeType='application/pdf' and trashed=false`);
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=nextPageToken,files(id,name,size)&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) throw new Error(`Drive ${r.status}`);
      const b: any = await r.json();
      files.push(...(b.files || []));
      pageToken = b.nextPageToken || '';
    } while (pageToken && files.length < 1000);
    res.json({ success: true, files });
  } catch (e: any) {
    console.error('[books scan]', e);
    res.status(502).json({ success: false, error: 'አቃፊውን ማንበብ አልተቻለም። አቃፊው ለ service account (Viewer) መጋራቱንና Drive API መብራቱን ያረጋግጡ።' });
  }
});

// Super admin: save many book -> Drive file links at once.
booksRouter.post('/admin/map-bulk', requireSuperAdmin, async (req: Request, res: Response) => {
  const items = Array.isArray(req.body?.items) ? req.body.items.slice(0, 200) : [];
  let saved = 0;
  for (const it of items) {
    const bookId = String(it?.bookId || '');
    const fileId = parseDriveFileId(it?.driveFile);
    if (!BOOK_ID_RE.test(bookId) || !fileId) continue;
    await adminDb.collection('book_files').doc(bookId).set({ driveFileId: fileId, updatedBy: req.user!.uid, updatedAt: new Date().toISOString() }, { merge: true });
    saved++;
  }
  res.json({ success: true, saved });
});

// Super admin: list mapped books.
booksRouter.get('/admin/list', requireSuperAdmin, async (_req: Request, res: Response) => {
  const snap = await adminDb.collection('book_files').get();
  res.json({ success: true, books: snap.docs.map((d: any) => ({ bookId: d.id, ...d.data() })) });
});

// Which books have a PDF available (so the client can show the PDF reader button).
booksRouter.get('/available', async (_req: Request, res: Response) => {
  const snap = await adminDb.collection('book_files').get();
  res.json({ success: true, bookIds: snap.docs.map((d: any) => d.id) });
});

// Stream the PDF to an entitled student.
booksRouter.get('/:bookId/file', async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  if (!BOOK_ID_RE.test(bookId)) return res.status(400).json({ success: false, error: 'Bad book id' });

  // Plan check (super admin passes inside isPremiumActive).
  if (!isPremiumActive(req.user)) {
    return res.status(402).json({ success: false, code: 'SUBSCRIPTION_REQUIRED', error: 'መጽሐፉን ለማንበብ ወርሃዊ ክፍያ ያስፈልጋል።' });
  }

  try {
    const snap = await adminDb.collection('book_files').doc(bookId).get();
    const fileId = snap.exists ? String(snap.data()?.driveFileId || '') : '';
    if (!FILE_ID_RE.test(fileId)) return res.status(404).json({ success: false, error: 'ይህ መጽሐፍ ገና አልተጫነም።' });

    const token = await auth.getAccessToken();
    const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
    if (typeof req.headers.range === 'string') headers.Range = req.headers.range;

    const upstream = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
      { headers }
    );
    if (upstream.status === 404 || upstream.status === 403) {
      return res.status(502).json({ success: false, error: 'ሰርቨሩ ፋይሉን ማግኘት አልቻለም። ፋይሉ ለ service account መጋራቱን ያረጋግጡ።' });
    }
    if (!upstream.ok && upstream.status !== 206) {
      return res.status(502).json({ success: false, error: `Drive error ${upstream.status}` });
    }

    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="book.pdf"');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    for (const h of ['content-length', 'content-range']) {
      const v = upstream.headers.get(h);
      if (v) res.setHeader(h, v);
    }
    if (!upstream.body) return res.end();
    const stream = Readable.fromWeb(upstream.body as any);
    req.on('close', () => stream.destroy());
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  } catch (e: any) {
    console.error('[books]', e);
    const cred = /credential|permission|invalid_grant|scope/i.test(String(e?.message || e));
    if (!res.headersSent) {
      res.status(cred ? 503 : 500).json({ success: false, error: cred ? 'የ Drive ፈቃድ ችግር (service account)።' : 'መጽሐፉን መጫን አልተቻለም።' });
    }
  }
});
