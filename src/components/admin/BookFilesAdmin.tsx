import React, { useEffect, useState } from 'react';
import { authFetch } from '../../services/apiClient';
import { TEXTBOOKS_REGISTRY, TextbookRecord } from '../../data/textbooksRegistry';

interface DriveFile { id: string; name: string; size?: string }

const norm = (s: string) => s.toLowerCase().replace(/\.pdf$/, '').replace(/[^a-z0-9ሀ-]+/g, ' ').trim();

/** Rough filename -> book guess: grade number must match, then count shared subject words. */
function suggest(book: TextbookRecord, files: DriveFile[]): string {
  const words = new Set(
    [book.subjectCode, book.subjectName.en, book.subjectName.am, book.title.en, book.title.am]
      .filter(Boolean).flatMap((t) => norm(String(t)).split(' ')).filter((w) => w.length > 2 && !/^(grade|textbook|student)$/.test(w))
  );
  let best = ''; let bestScore = 0;
  for (const f of files) {
    const n = norm(f.name);
    const g = n.match(/(?:grade|g|class)?\s*(9|10|11|12)\b/);
    if (!g || Number(g[1]) !== book.grade) continue;
    let score = 0;
    for (const w of n.split(' ')) if (words.has(w)) score++;
    if (score > bestScore) { best = f.id; bestScore = score; }
  }
  return best;
}

/** Super admin: link each book to a PDF in the private Google Drive folder (shared with the server's service account). */
export const BookFilesAdmin: React.FC = () => {
  const [mapped, setMapped] = useState<Record<string, string>>({});
  const [folder, setFolder] = useState('');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const r = await authFetch('/api/books/admin/list');
      const b = await r.json();
      const m: Record<string, string> = {};
      (b.books || []).forEach((x: any) => { m[x.bookId] = x.driveFileId; });
      setMapped(m);
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const post = async (path: string, body: any) => {
    const r = await authFetch(`/api/books/admin/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const b = await r.json().catch(() => ({}));
    if (!r.ok || !b.success) throw new Error(b.error || 'አልተሳካም');
    return b;
  };

  const scan = async () => {
    setBusy(true); setMsg('');
    try {
      const b = await post('scan', { folder });
      const fl: DriveFile[] = (b.files || []).sort((a: DriveFile, c: DriveFile) => a.name.localeCompare(c.name));
      setFiles(fl);
      const c: Record<string, string> = {};
      TEXTBOOKS_REGISTRY.forEach((bk) => { c[bk.id] = mapped[bk.id] || suggest(bk, fl); });
      setChoice(c);
      setMsg(`${fl.length} PDF ተገኝቷል። ግምቶቹን ያረጋግጡና ያስተካክሉ፣ ከዚያ "ሁሉንም አስቀምጥ" ይጫኑ።`);
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };

  const saveAll = async () => {
    setBusy(true); setMsg('');
    try {
      const items = Object.entries(choice).filter(([, f]) => f).map(([bookId, driveFile]) => ({ bookId, driveFile }));
      const b = await post('map-bulk', { items });
      setMsg(`✓ ${b.saved} መጽሐፍ ተገናኝቷል`);
      load();
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
      <h3 className="font-black text-sm">መጻሕፍት ↔ Google Drive PDF ({Object.keys(mapped).length} / {TEXTBOOKS_REGISTRY.length} ተገናኝተዋል)</h3>
      <p className="text-xs text-slate-500">"Nur books" አቃፊውን ለ service account (Viewer) ያጋሩ፣ የአቃፊውን ሊንክ እዚህ ይለጥፉና ይቃኙ። ሊንኩ ለተማሪ አይታይም።</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="https://drive.google.com/drive/folders/..." className="flex-1 px-3 py-2 rounded-xl border text-xs bg-transparent" />
        <button disabled={busy || !folder} onClick={scan} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-50">አቃፊውን ቃኝ</button>
      </div>
      {files.length > 0 && (
        <>
          <div className="max-h-96 overflow-auto space-y-1.5">
            {TEXTBOOKS_REGISTRY.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs">
                <div className="sm:w-1/2 font-semibold truncate">{choice[b.id] ? '✓ ' : '• '}Grade {b.grade} — {b.title.en || b.subjectName.en}</div>
                <select value={choice[b.id] || ''} onChange={(e) => setChoice((c) => ({ ...c, [b.id]: e.target.value }))} className="sm:w-1/2 px-2 py-1 rounded-lg border bg-transparent">
                  <option value="">— ፋይል አልተመረጠም —</option>
                  {files.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button disabled={busy} onClick={saveAll} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50">ሁሉንም አስቀምጥ</button>
        </>
      )}
      {msg && <div className="text-xs">{msg}</div>}
    </div>
  );
};
