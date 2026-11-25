import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { auth } from '../../services/firebase';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

interface Props {
  bookId: string;
  driveFileId?: string;
  watermark: string;
  zoom: number; // percent
  onPageChange?: (page: number, total: number) => void;
  onError?: (msg: string) => void;
}

/**
 * Streams the book PDF from our server (plan-checked) and renders pages lazily onto canvases.
 * No download link is ever exposed; only the pages near the viewport are fetched/rendered.
 */
export const PdfBookViewer: React.FC<Props> = ({ bookId, driveFileId, watermark, zoom, onPageChange, onError }) => {
  const [doc, setDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 600, h: 800 });

  const streamUrl = driveFileId
    ? `/api/books/drive/${encodeURIComponent(driveFileId)}/file`
    : `/api/books/${encodeURIComponent(bookId)}/file`;

  useEffect(() => {
    let cancelled = false;
    let task: pdfjs.PDFDocumentLoadingTask | null = null;
    (async () => {
      setStatus('loading');
      setMessage('');
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('እባክዎ መጀመሪያ ይግቡ።');
        // Probe once to surface plan / setup errors as readable messages.
        const probe = await fetch(streamUrl, {
          headers: { Authorization: `Bearer ${token}`, Range: 'bytes=0-0' },
        });
        if (!probe.ok && probe.status !== 206) {
          const b = await probe.json().catch(() => ({}));
          throw new Error(b?.error || `Error ${probe.status}`);
        }
        task = pdfjs.getDocument({
          url: streamUrl,
          httpHeaders: { Authorization: `Bearer ${token}` },
          rangeChunkSize: 512 * 1024,
          disableAutoFetch: true,
          disableStream: false,
        });
        const d = await task.promise;
        if (cancelled) return;
        const p1 = await d.getPage(1);
        const vp = p1.getViewport({ scale: 1 });
        setDims({ w: vp.width, h: vp.height });
        setDoc(d);
        setStatus('ready');
      } catch (e: any) {
        if (cancelled) return;
        setStatus('error');
        setMessage(e?.message || 'መጽሐፉን መጫን አልተቻለም።');
        onError?.(e?.message || 'load failed');
      }
    })();
    return () => {
      cancelled = true;
      task?.destroy();
    };
  }, [streamUrl]);

  if (status === 'loading') return <div className="p-10 text-sm text-slate-500">መጽሐፉ እየተጫነ ነው...</div>;
  if (status === 'error' || !doc) return <div className="p-10 text-sm text-rose-600">{message}</div>;

  return (
    <div className="w-full flex flex-col items-center gap-4 select-none" onContextMenu={(e) => e.preventDefault()}>
      {Array.from({ length: doc.numPages }, (_, i) => (
        <PdfPage key={i + 1} doc={doc} pageNo={i + 1} dims={dims} watermark={watermark} zoom={zoom} total={doc.numPages} onVisible={onPageChange} />
      ))}
    </div>
  );
};

const PdfPage: React.FC<{
  doc: pdfjs.PDFDocumentProxy; pageNo: number; dims: { w: number; h: number }; watermark: string; zoom: number; total: number;
  onVisible?: (p: number, t: number) => void;
}> = ({ doc, pageNo, dims, watermark, zoom, total, onVisible }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(false);
  const width = Math.min(900, dims.w) * (zoom / 100);
  const height = (dims.h / dims.w) * width;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting && e.intersectionRatio > 0.4) onVisible?.(pageNo, total);
      },
      { rootMargin: '600px 0px', threshold: [0, 0.4] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pageNo, total]);

  useEffect(() => {
    if (!near || !canvasRef.current) return;
    let cancelled = false;
    let renderTask: any;
    (async () => {
      const page = await doc.getPage(pageNo);
      if (cancelled || !canvasRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: (width / base.width) * dpr });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      renderTask = page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport });
      await renderTask.promise.catch(() => {});
    })();
    return () => {
      cancelled = true;
      try { renderTask?.cancel(); } catch {}
    };
  }, [near, doc, pageNo, width]);

  return (
    <div ref={wrapRef} className="relative bg-white shadow-md" style={{ width, height }}>
      {near && <canvas ref={canvasRef} style={{ width, height }} />}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12] flex flex-col justify-around" style={{ transform: 'rotate(-25deg) scale(1.4)' }}>
        {Array.from({ length: 5 }).map((_, r) => (
          <div key={r} className="whitespace-nowrap text-xs font-black tracking-widest text-slate-900 text-center">{`${watermark}   ${watermark}   ${watermark}`}</div>
        ))}
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] text-slate-400">{pageNo} / {total}</div>
    </div>
  );
};
