import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, FolderOpen } from 'lucide-react';
import { authFetch } from '../../services/apiClient';
import { TEXTBOOKS_REGISTRY, TextbookRecord } from '../../data/textbooksRegistry';

interface DriveFile {
  id: string;
  name: string;
  mimeType?: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  grade?: 9 | 10 | 11 | 12 | null;
}

interface DriveStatus {
  connected: boolean;
  credentialSource?: string;
  activeServiceAccount?: string | null;
  expectedServiceAccount?: string;
  folderId?: string;
  folderName?: string;
  totalFiles?: number;
  gradeCounts?: Record<string, number>;
  fetchedAt?: string;
  error?: string;
  details?: string;
}

const DEFAULT_NUR_BOOKS_FOLDER = '1N3US5V-yH6fQv18MHA_NGgAtVod0-21H';

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
    const detectedGrade = f.grade ?? (g ? Number(g[1]) : null);
    if (detectedGrade !== book.grade) continue;
    let score = 0;
    for (const w of n.split(' ')) if (words.has(w)) score++;
    if (score > bestScore) { best = f.id; bestScore = score; }
  }
  return best;
}

/** Super admin: manage Nur Books Google Drive sync and map PDFs to catalog entries. */
export const BookFilesAdmin: React.FC = () => {
  const [mapped, setMapped] = useState<Record<string, string>>({});
  const [folder, setFolder] = useState(DEFAULT_NUR_BOOKS_FOLDER);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [driveStatus, setDriveStatus] = useState<DriveStatus | null>(null);

  const loadMapped = async () => {
    try {
      const r = await authFetch('/api/books/admin/list');
      const b = await r.json();
      const m: Record<string, string> = {};
      (b.books || []).forEach((x: any) => { m[x.bookId] = x.driveFileId; });
      setMapped(m);
    } catch { /* ignore */ }
  };

  const checkDriveStatus = async () => {
    try {
      const r = await authFetch('/api/books/admin/drive-status');
      const b = await r.json().catch(() => ({}));
      setDriveStatus(b);
    } catch (e: any) {
      setDriveStatus({ connected: false, error: e?.message || 'Status check failed' });
    }
  };

  useEffect(() => {
    loadMapped();
    checkDriveStatus();
  }, []);

  const post = async (path: string, body: any) => {
    const r = await authFetch(`/api/books/admin/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const b = await r.json().catch(() => ({}));
    if (!r.ok || !b.success) throw new Error(b.error || `አልተሳካም (HTTP ${r.status})`);
    return b;
  };

  const applyCatalogFiles = (fl: DriveFile[]) => {
    const sorted = [...fl].sort((a, c) => a.name.localeCompare(c.name));
    setFiles(sorted);
    const c: Record<string, string> = {};
    TEXTBOOKS_REGISTRY.forEach((bk) => { c[bk.id] = mapped[bk.id] || suggest(bk, sorted); });
    setChoice(c);
  };

  const handleRefreshBooks = async () => {
    setRefreshing(true);
    setMsg('');
    try {
      const b = await post('refresh', {});
      const fl: DriveFile[] = Array.isArray(b.files) ? b.files : [];
      applyCatalogFiles(fl);
      setDriveStatus((prev) => ({
        ...prev,
        connected: true,
        folderId: b.folderId,
        folderName: b.folderName,
        totalFiles: b.totalFiles,
        gradeCounts: b.gradeCounts,
        fetchedAt: b.fetchedAt,
        error: undefined,
      }));
      setMsg(`✓ Refresh Books ተሳክቷል፦ ${b.totalFiles ?? fl.length} PDF መጻሕፍት ከ "${b.folderName || 'Nur Books'}" ተገኝተዋል።`);
    } catch (e: any) {
      setMsg(e.message || 'Refresh Books አልተሳካም።');
      await checkDriveStatus();
    } finally {
      setRefreshing(false);
    }
  };

  const scan = async () => {
    setBusy(true); setMsg('');
    try {
      const b = await post('scan', { folder });
      const fl: DriveFile[] = b.files || [];
      applyCatalogFiles(fl);
      setMsg(`${fl.length} PDF ተገኝቷል። ግምቶቹን ያረጋግጡና ያስተካክሉ፣ ከዚያ "ሁሉንም አስቀምጥ" ይጫኑ።`);
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };

  const saveAll = async () => {
    setBusy(true); setMsg('');
    try {
      const items = Object.entries(choice).filter(([, f]) => f).map(([bookId, driveFile]) => ({ bookId, driveFile }));
      if (items.length === 0) {
        setMsg('ቢያንስ አንድ መጽሐፍ ከ Drive PDF ጋር ይምረጡ።');
        return;
      }
      const b = await post('map-bulk', { items });
      setMsg(`✓ ${b.saved} መጽሐፍ ተገናኝቷል`);
      await loadMapped();
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-sm flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-600" />
            <span>መጻሕፍት ↔ Google Drive "Nur Books" ({Object.keys(mapped).length} / {TEXTBOOKS_REGISTRY.length} ተገናኝተዋል)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            "Nur Books" አቃፊ (<code className="font-mono">{DEFAULT_NUR_BOOKS_FOLDER}</code>) ለ service account (Viewer) የተጋራ ሲሆን፣ PDF ሊንኩ ለተማሪ አይታይም።
          </p>
        </div>

        <button
          type="button"
          disabled={refreshing || busy}
          onClick={handleRefreshBooks}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 shrink-0 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'በማደስ ላይ...' : 'Refresh Books (መጻሕፍትን አድስ)'}</span>
        </button>
      </div>

      {driveStatus && (
        <div
          className={`p-3 rounded-xl border text-xs space-y-1 ${
            driveStatus.connected
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2 font-bold">
            <span className="flex items-center gap-1.5">
              {driveStatus.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>
                {driveStatus.connected
                  ? `Google Drive ተገናኝቷል • "${driveStatus.folderName || 'Nur Books'}" (${driveStatus.totalFiles ?? 0} PDFs)`
                  : 'Google Drive የሰርቨር ፈቃድ ይጠብቃል (Pending Server Credentials)'}
              </span>
            </span>
            {driveStatus.credentialSource && (
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Auth: {driveStatus.credentialSource}
              </span>
            )}
          </div>

          {driveStatus.connected && driveStatus.gradeCounts && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              <span>Grade 9: {driveStatus.gradeCounts['9'] ?? 0}</span>
              <span>• Grade 10: {driveStatus.gradeCounts['10'] ?? 0}</span>
              <span>• Grade 11: {driveStatus.gradeCounts['11'] ?? 0}</span>
              <span>• Grade 12: {driveStatus.gradeCounts['12'] ?? 0}</span>
              {(driveStatus.gradeCounts['uncategorized'] ?? 0) > 0 && (
                <span>• Other: {driveStatus.gradeCounts['uncategorized']}</span>
              )}
            </div>
          )}

          {!driveStatus.connected && (
            <div className="text-[11px] space-y-1 pt-0.5">
              <div>{driveStatus.error}</div>
              {driveStatus.activeServiceAccount && driveStatus.expectedServiceAccount && (
                <div className="font-mono text-[10px] opacity-80">
                  Active runtime identity: {driveStatus.activeServiceAccount} | Expected: {driveStatus.expectedServiceAccount}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder="https://drive.google.com/drive/folders/..."
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-transparent"
        />
        <button
          type="button"
          disabled={busy || refreshing || !folder}
          onClick={scan}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-50"
        >
          አቃፊውን ቃኝ
        </button>
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
          <button
            type="button"
            disabled={busy}
            onClick={saveAll}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50"
          >
            ሁሉንም አስቀምጥ
          </button>
        </>
      )}
      {msg && <div className="text-xs font-semibold">{msg}</div>}
    </div>
  );
};
