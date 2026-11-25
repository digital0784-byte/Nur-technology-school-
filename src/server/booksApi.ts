import { Router, Request, Response } from 'express';
import { Readable } from 'node:stream';
import { GoogleAuth } from 'google-auth-library';
import { adminDb } from './adminDb';
import { requireSuperAdmin, isPremiumActive } from './authMiddleware';

export const booksRouter = Router();

// Books live in a PRIVATE Google Drive folder ("Nur Books") shared only with the server's
// service account. Students never see a raw Drive download link: the backend verifies
// authentication, grade authorization, and subscription status, then streams the PDF
// with HTTP Range support so large textbooks load page by page inside PdfBookViewer.

export const DEFAULT_NUR_BOOKS_FOLDER_ID = '1N3US5V-yH6fQv18MHA_NGgAtVod0-21H';
export const EXPECTED_DRIVE_SA_EMAIL = 'firebase-adminsdk-fbsvc@nur-technology-school.iam.gserviceaccount.com';
const DRIVE_READONLY_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

const FILE_ID_RE = /^[A-Za-z0-9_-]{10,100}$/;
const BOOK_ID_RE = /^[A-Za-z0-9_.-]{1,100}$/;
const PAGE_TOKEN_RE = /^[A-Za-z0-9_~.=+/-]{1,500}$/;

export type GradeNumber = 9 | 10 | 11 | 12;

export interface DriveBookFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  grade: GradeNumber | null;
  folderName?: string;
}

export interface DriveCatalogResult {
  folderId: string;
  folderName: string;
  fetchedAt: string;
  byGrade: Record<'9' | '10' | '11' | '12', DriveBookFile[]>;
  uncategorized: DriveBookFile[];
  allFiles: DriveBookFile[];
  detectedFolders: Array<{ id: string; name: string; grade: GradeNumber | null }>;
}

interface AuthResolution {
  auth: GoogleAuth;
  source: 'FIRESTORE_SERVICE_ACCOUNT_JSON';
  clientEmail: string;
  projectId?: string;
}

export function getDriveAuthResolution(): AuthResolution {
  const raw = process.env.FIRESTORE_SERVICE_ACCOUNT_JSON;
  if (!raw || !raw.trim()) {
    const err: any = new Error(
      'Missing server environment secret FIRESTORE_SERVICE_ACCOUNT_JSON. Configure the service account JSON for firebase-adminsdk-fbsvc@nur-technology-school.iam.gserviceaccount.com.'
    );
    err.httpStatus = 503;
    err.code = 'DRIVE_CREDENTIALS_MISSING';
    throw err;
  }

  let credentials: any;
  try {
    credentials = JSON.parse(raw);
  } catch {
    const err: any = new Error('FIRESTORE_SERVICE_ACCOUNT_JSON is not valid JSON.');
    err.httpStatus = 503;
    err.code = 'DRIVE_CREDENTIALS_INVALID';
    throw err;
  }

  if (
    !credentials ||
    typeof credentials !== 'object' ||
    credentials.type !== 'service_account' ||
    typeof credentials.client_email !== 'string' ||
    typeof credentials.private_key !== 'string' ||
    !credentials.private_key.includes('BEGIN PRIVATE KEY')
  ) {
    const err: any = new Error(
      'FIRESTORE_SERVICE_ACCOUNT_JSON is missing required service_account fields (client_email / private_key).'
    );
    err.httpStatus = 503;
    err.code = 'DRIVE_CREDENTIALS_INVALID';
    throw err;
  }

  const actualEmail = credentials.client_email.trim();
  const actualProjectId = typeof credentials.project_id === 'string' ? credentials.project_id.trim() : undefined;

  if (actualEmail.toLowerCase() !== EXPECTED_DRIVE_SA_EMAIL.toLowerCase()) {
    const err: any = new Error(
      `Configured service account (${actualEmail}, project: ${actualProjectId || 'unknown'}) does not match expected Drive service account (${EXPECTED_DRIVE_SA_EMAIL}).`
    );
    err.httpStatus = 503;
    err.code = 'DRIVE_SERVICE_ACCOUNT_MISMATCH';
    err.clientEmail = actualEmail;
    err.projectId = actualProjectId;
    throw err;
  }

  if (actualProjectId && actualProjectId !== 'nur-technology-school') {
    const err: any = new Error(
      `Configured project_id (${actualProjectId}) does not match expected project (nur-technology-school).`
    );
    err.httpStatus = 503;
    err.code = 'DRIVE_PROJECT_MISMATCH';
    err.clientEmail = actualEmail;
    err.projectId = actualProjectId;
    throw err;
  }

  return {
    auth: new GoogleAuth({
      credentials,
      scopes: [DRIVE_READONLY_SCOPE],
    }),
    source: 'FIRESTORE_SERVICE_ACCOUNT_JSON',
    clientEmail: actualEmail,
    projectId: actualProjectId,
  };
}

function getConfiguredRootFolderId(): string {
  return parseDriveFileId(process.env.GOOGLE_DRIVE_FOLDER_ID || DEFAULT_NUR_BOOKS_FOLDER_ID) || DEFAULT_NUR_BOOKS_FOLDER_ID;
}

/** Accepts a bare Drive file/folder id or a full Drive share URL and returns the id. */
export function parseDriveFileId(input: string): string | null {
  const s = String(input || '').trim();
  const m =
    s.match(/\/folders\/([A-Za-z0-9_-]{10,100})/) ||
    s.match(/\/d\/([A-Za-z0-9_-]{10,100})/) ||
    s.match(/[?&]id=([A-Za-z0-9_-]{10,100})/);
  const id = m ? m[1] : s;
  return FILE_ID_RE.test(id) ? id : null;
}

export function detectGradeFromLabel(label: string): GradeNumber | null {
  const s = String(label || '').trim();
  const m = s.match(/(?:^|\b)(?:grade|gr|g|class)?[\s_-]*(9|10|11|12)(?:\b|$)/i);
  if (!m) return null;
  const g = Number(m[1]);
  return g === 9 || g === 10 || g === 11 || g === 12 ? g : null;
}

function parseDriveError(status: number, bodyText: string): { status: number; code: string; message: string; details?: string } {
  let parsed: any = null;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    parsed = null;
  }
  const apiMessage = String(parsed?.error?.message || bodyText || `Drive HTTP ${status}`).slice(0, 400);
  const errorReason = String(parsed?.error?.errors?.[0]?.reason || '');
  const detailReason = String(parsed?.error?.details?.find?.((d: any) => d?.reason)?.reason || '');

  if (status === 403 && (errorReason === 'accessNotConfigured' || detailReason === 'SERVICE_DISABLED')) {
    return {
      status: 503,
      code: 'DRIVE_API_DISABLED',
      message: 'Google Drive API is disabled for the service account Google Cloud project. Enable drive.googleapis.com and retry.',
      details: apiMessage,
    };
  }
  if (status === 401 || status === 403) {
    return {
      status: 502,
      code: 'DRIVE_ACCESS_DENIED',
      message: 'Server service account does not have Viewer permission for this Drive folder or Drive API access is denied.',
      details: apiMessage,
    };
  }
  if (status === 404) {
    return {
      status: 404,
      code: 'DRIVE_FOLDER_NOT_FOUND',
      message: 'The configured Nur Books Google Drive folder could not be found or is not shared with the service account.',
      details: apiMessage,
    };
  }
  return {
    status: 502,
    code: 'DRIVE_UPSTREAM_ERROR',
    message: `Google Drive returned HTTP ${status}.`,
    details: apiMessage,
  };
}

// In-memory cache (5 minute TTL) + authorized file index for Nur Books streaming
const CATALOG_TTL_MS = 5 * 60 * 1000;
let cachedCatalog: { expiresAt: number; data: DriveCatalogResult } | null = null;
const authorizedDriveFiles = new Map<string, DriveBookFile>();

async function driveJsonFetch(url: string, token: string): Promise<any> {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await r.text();
  if (!r.ok) {
    const errInfo = parseDriveError(r.status, text);
    const err: any = new Error(errInfo.message);
    err.httpStatus = errInfo.status;
    err.upstreamStatus = r.status;
    err.code = errInfo.code;
    err.details = errInfo.details;
    throw err;
  }
  return JSON.parse(text);
}

async function listDriveFolderChildren(
  folderId: string,
  token: string,
  options: { mimeFilter?: 'pdf' | 'all'; pageToken?: string; pageSize?: number } = {}
): Promise<{ files: any[]; nextPageToken?: string }> {
  const clauses = [`'${folderId}' in parents`, 'trashed=false'];
  if (options.mimeFilter === 'pdf') {
    clauses.push(`mimeType='application/pdf'`);
  }
  const q = encodeURIComponent(clauses.join(' and '));
  const safePageSize = Math.max(1, Math.min(options.pageSize || 100, 200));
  const tokenParam = options.pageToken && PAGE_TOKEN_RE.test(options.pageToken)
    ? `&pageToken=${encodeURIComponent(options.pageToken)}`
    : '';

  const url =
    `https://www.googleapis.com/drive/v3/files?q=${q}` +
    `&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink)` +
    `&orderBy=name&pageSize=${safePageSize}` +
    `&supportsAllDrives=true&includeItemsFromAllDrives=true${tokenParam}`;

  const data = await driveJsonFetch(url, token);
  return {
    files: Array.isArray(data.files) ? data.files : [],
    nextPageToken: typeof data.nextPageToken === 'string' ? data.nextPageToken : undefined,
  };
}

async function listAllDriveChildren(folderId: string, token: string, mimeFilter: 'pdf' | 'all' = 'all'): Promise<any[]> {
  const collected: any[] = [];
  let pageToken: string | undefined;
  do {
    const page = await listDriveFolderChildren(folderId, token, { mimeFilter, pageToken, pageSize: 200 });
    collected.push(...page.files);
    pageToken = page.nextPageToken;
  } while (pageToken && collected.length < 1000);
  return collected;
}

export async function fetchNurBooksCatalog(forceRefresh = false): Promise<DriveCatalogResult> {
  if (!forceRefresh && cachedCatalog && Date.now() < cachedCatalog.expiresAt) {
    return cachedCatalog.data;
  }

  const folderId = getConfiguredRootFolderId();
  const { auth } = getDriveAuthResolution();
  const token = await auth.getAccessToken();
  if (!token) {
    const err: any = new Error('Unable to acquire Google Drive OAuth access token from server credentials.');
    err.httpStatus = 503;
    err.code = 'DRIVE_TOKEN_UNAVAILABLE';
    throw err;
  }

  // Verify root folder metadata first
  const folderMeta = await driveJsonFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folderId)}?fields=id,name,mimeType&supportsAllDrives=true`,
    token
  );

  const rootItems = await listAllDriveChildren(folderId, token, 'all');

  const byGrade: Record<'9' | '10' | '11' | '12', DriveBookFile[]> = {
    '9': [],
    '10': [],
    '11': [],
    '12': [],
  };
  const uncategorized: DriveBookFile[] = [];
  const detectedFolders: Array<{ id: string; name: string; grade: GradeNumber | null }> = [];
  const nextAuthorizedMap = new Map<string, DriveBookFile>();

  const registerFile = (raw: any, explicitGrade: GradeNumber | null, folderName?: string) => {
    if (!raw?.id || raw.mimeType !== 'application/pdf') return;
    const resolvedGrade = explicitGrade ?? detectGradeFromLabel(raw.name);
    const entry: DriveBookFile = {
      id: String(raw.id),
      name: String(raw.name || 'Untitled Book.pdf'),
      mimeType: String(raw.mimeType),
      size: raw.size ? String(raw.size) : undefined,
      modifiedTime: raw.modifiedTime ? String(raw.modifiedTime) : undefined,
      webViewLink: raw.webViewLink ? String(raw.webViewLink) : undefined,
      grade: resolvedGrade,
      folderName,
    };
    nextAuthorizedMap.set(entry.id, entry);
    if (resolvedGrade) {
      byGrade[String(resolvedGrade) as '9' | '10' | '11' | '12'].push(entry);
    } else {
      uncategorized.push(entry);
    }
  };

  for (const item of rootItems) {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      const folderGrade = detectGradeFromLabel(item.name);
      detectedFolders.push({ id: String(item.id), name: String(item.name), grade: folderGrade });
      if (folderGrade) {
        const subFiles = await listAllDriveChildren(String(item.id), token, 'pdf');
        for (const sf of subFiles) {
          registerFile(sf, folderGrade, String(item.name));
        }
      }
    } else if (item.mimeType === 'application/pdf') {
      registerFile(item, null, String(folderMeta?.name || 'Nur Books'));
    }
  }

  // Deduplicate by file id in case a file appears via symlink/shortcut
  const dedupedAll = Array.from(nextAuthorizedMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  for (const g of ['9', '10', '11', '12'] as const) {
    byGrade[g].sort((a, b) => a.name.localeCompare(b.name));
  }
  uncategorized.sort((a, b) => a.name.localeCompare(b.name));

  authorizedDriveFiles.clear();
  for (const f of dedupedAll) {
    authorizedDriveFiles.set(f.id, f);
  }

  const result: DriveCatalogResult = {
    folderId,
    folderName: String(folderMeta?.name || 'Nur Books'),
    fetchedAt: new Date().toISOString(),
    byGrade,
    uncategorized,
    allFiles: dedupedAll,
    detectedFolders,
  };

  cachedCatalog = {
    expiresAt: Date.now() + CATALOG_TTL_MS,
    data: result,
  };

  return result;
}

// ---------------------------------------------------------------------------
// Super Admin Drive Diagnostics & Refresh Endpoints
// ---------------------------------------------------------------------------

export async function runDriveStartupDiagnostic(): Promise<{
  testedAt: string;
  secretPresent: boolean;
  matchingEnvKeyNames: string[];
  connected: boolean;
  serviceAccountEmail?: string;
  projectId?: string;
  folderId: string;
  folderName?: string;
  directItemsCount?: number;
  totalPdfCount?: number;
  first10Items?: Array<{ id: string; name: string; mimeType: string; modifiedTime?: string; size?: string }>;
  first10Pdfs?: Array<{ id: string; name: string; mimeType: string; modifiedTime?: string; size?: string; grade?: GradeNumber | null }>;
  upstreamStatus?: number;
  errorCode?: string;
  errorMessage?: string;
  details?: string;
}> {
  const folderId = getConfiguredRootFolderId();
  const testedAt = new Date().toISOString();
  const secretPresent = Boolean(process.env.FIRESTORE_SERVICE_ACCOUNT_JSON?.trim());
  const matchingEnvKeyNames = Object.keys(process.env)
    .filter((k) => !/^(PATH|HOME|PWD|SHLVL|LANG|LANGUAGE|LC_ALL|NODE_|YARN_|NPM_|npm_|PORT|DEFAULT_APP_PORT|NGINX_PORT|CLOUD_RUN_|K_|CNB_|CONTROL_PLANE_|PLAYWRIGHT_|CSP_|GOMEMLIMIT|NEXT_|GOOGLE_RUNTIME|APPLET_|APP_DIR|APP_URL|_)/i.test(k))
    .sort();

  let resolution: AuthResolution | undefined;
  try {
    resolution = getDriveAuthResolution();
    const token = await resolution.auth.getAccessToken();
    if (!token) {
      return {
        testedAt,
        secretPresent,
        matchingEnvKeyNames,
        connected: false,
        serviceAccountEmail: resolution.clientEmail,
        projectId: resolution.projectId,
        folderId,
        errorCode: 'DRIVE_TOKEN_UNAVAILABLE',
        errorMessage: 'Failed to obtain OAuth access token for Drive service account.',
      };
    }

    const folderMeta = await driveJsonFetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folderId)}?fields=id,name,mimeType&supportsAllDrives=true`,
      token
    );
    const directPage = await listDriveFolderChildren(folderId, token, { mimeFilter: 'all', pageSize: 10 });
    const catalog = await fetchNurBooksCatalog(true);

    return {
      testedAt,
      secretPresent,
      matchingEnvKeyNames,
      connected: true,
      serviceAccountEmail: resolution.clientEmail,
      projectId: resolution.projectId,
      folderId,
      folderName: String(folderMeta?.name || catalog.folderName || 'Nur Books'),
      directItemsCount: directPage.files.length,
      totalPdfCount: catalog.allFiles.length,
      first10Items: directPage.files.slice(0, 10).map((f: any) => ({
        id: String(f.id),
        name: String(f.name),
        mimeType: String(f.mimeType),
        modifiedTime: f.modifiedTime ? String(f.modifiedTime) : undefined,
        size: f.size ? String(f.size) : undefined,
      })),
      first10Pdfs: catalog.allFiles.slice(0, 10).map((f) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        modifiedTime: f.modifiedTime,
        size: f.size,
        grade: f.grade,
      })),
    };
  } catch (e: any) {
    return {
      testedAt,
      secretPresent,
      matchingEnvKeyNames,
      connected: false,
      serviceAccountEmail: resolution?.clientEmail ?? e?.clientEmail,
      projectId: resolution?.projectId ?? e?.projectId,
      folderId,
      upstreamStatus: typeof e?.upstreamStatus === 'number' ? e.upstreamStatus : undefined,
      errorCode: e?.code || 'DRIVE_CONNECTION_FAILED',
      errorMessage: e?.message || 'Google Drive diagnostic failed.',
      details: e?.details,
    };
  }
}

booksRouter.get('/admin/drive-status', requireSuperAdmin, async (_req: Request, res: Response) => {
  const folderId = getConfiguredRootFolderId();
  let resolution: AuthResolution | null = null;
  try {
    resolution = getDriveAuthResolution();
  } catch (e: any) {
    return res.status(e?.httpStatus || 503).json({
      success: false,
      connected: false,
      code: e?.code || 'DRIVE_CREDENTIALS_MISSING',
      credentialSource: 'FIRESTORE_SERVICE_ACCOUNT_JSON',
      activeServiceAccount: null,
      expectedServiceAccount: EXPECTED_DRIVE_SA_EMAIL,
      folderId,
      error: e?.message || 'Google Drive service account credentials are not configured.',
    });
  }

  try {
    const catalog = await fetchNurBooksCatalog(true);
    return res.json({
      success: true,
      connected: true,
      credentialSource: resolution.source,
      activeServiceAccount: resolution.clientEmail,
      expectedServiceAccount: EXPECTED_DRIVE_SA_EMAIL,
      projectId: resolution.projectId,
      folderId,
      folderName: catalog.folderName,
      totalFiles: catalog.allFiles.length,
      gradeCounts: {
        9: catalog.byGrade['9'].length,
        10: catalog.byGrade['10'].length,
        11: catalog.byGrade['11'].length,
        12: catalog.byGrade['12'].length,
        uncategorized: catalog.uncategorized.length,
      },
      detectedFolders: catalog.detectedFolders,
      fetchedAt: catalog.fetchedAt,
    });
  } catch (e: any) {
    const httpStatus = typeof e?.httpStatus === 'number' ? e.httpStatus : 502;
    return res.status(httpStatus).json({
      success: false,
      connected: false,
      code: e?.code || 'DRIVE_CONNECTION_FAILED',
      credentialSource: resolution.source,
      activeServiceAccount: resolution.clientEmail,
      expectedServiceAccount: EXPECTED_DRIVE_SA_EMAIL,
      projectId: resolution.projectId,
      folderId,
      error: e?.message || 'Unable to connect to Google Drive folder.',
      details: e?.details,
    });
  }
});

// Super admin: force-refresh Nur Books Drive catalog cache
booksRouter.post('/admin/refresh', requireSuperAdmin, async (_req: Request, res: Response) => {
  cachedCatalog = null;
  try {
    const catalog = await fetchNurBooksCatalog(true);
    return res.json({
      success: true,
      folderId: catalog.folderId,
      folderName: catalog.folderName,
      fetchedAt: catalog.fetchedAt,
      totalFiles: catalog.allFiles.length,
      gradeCounts: {
        9: catalog.byGrade['9'].length,
        10: catalog.byGrade['10'].length,
        11: catalog.byGrade['11'].length,
        12: catalog.byGrade['12'].length,
        uncategorized: catalog.uncategorized.length,
      },
      files: catalog.allFiles,
      byGrade: catalog.byGrade,
    });
  } catch (e: any) {
    console.error('[books refresh]', e?.message || e);
    const httpStatus = typeof e?.httpStatus === 'number' ? e.httpStatus : 502;
    return res.status(httpStatus).json({
      success: false,
      code: e?.code || 'DRIVE_REFRESH_FAILED',
      error: e?.message || 'መጻሕፍቱን ከ Google Drive ማደስ አልተቻለም።',
      details: e?.details,
    });
  }
});

// ---------------------------------------------------------------------------
// Paginated & Grade-Organized Nur Books Catalog Listing (Authenticated Users)
// ---------------------------------------------------------------------------

booksRouter.get('/drive/list', async (req: Request, res: Response) => {
  const isSuper = req.user?.role === 'super_admin';
  const requestedGradeRaw = req.query.grade ? Number(req.query.grade) : null;
  const requestedGrade: GradeNumber | null =
    requestedGradeRaw === 9 || requestedGradeRaw === 10 || requestedGradeRaw === 11 || requestedGradeRaw === 12
      ? requestedGradeRaw
      : null;

  // Enforce student's registered grade when known
  const effectiveGrade: GradeNumber | null = isSuper
    ? requestedGrade
    : (req.user?.grade === 9 || req.user?.grade === 10 || req.user?.grade === 11 || req.user?.grade === 12
        ? req.user.grade
        : requestedGrade);

  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.max(1, Math.min(Number(req.query.pageSize) || 24, 100));
  const rawPageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken : '';
  const forceRefresh = isSuper && req.query.refresh === '1';

  try {
    // Support direct Drive API cursor pagination if pageToken is explicitly passed
    if (rawPageToken && PAGE_TOKEN_RE.test(rawPageToken)) {
      const folderId = getConfiguredRootFolderId();
      const { auth } = getDriveAuthResolution();
      const token = await auth.getAccessToken();
      if (!token) {
        return res.status(503).json({ success: false, code: 'DRIVE_TOKEN_UNAVAILABLE', error: 'Drive token unavailable.' });
      }
      const rawPage = await listDriveFolderChildren(folderId, token, {
        mimeFilter: 'pdf',
        pageToken: rawPageToken,
        pageSize,
      });
      const files: DriveBookFile[] = rawPage.files
        .map((f: any) => ({
          id: String(f.id),
          name: String(f.name || 'Untitled.pdf'),
          mimeType: String(f.mimeType || 'application/pdf'),
          size: f.size ? String(f.size) : undefined,
          modifiedTime: f.modifiedTime ? String(f.modifiedTime) : undefined,
          webViewLink: isSuper && f.webViewLink ? String(f.webViewLink) : undefined,
          grade: detectGradeFromLabel(f.name),
        }))
        .filter((f) => isSuper || !effectiveGrade || !f.grade || f.grade === effectiveGrade);

      return res.json({
        success: true,
        folderId,
        files,
        nextPageToken: rawPage.nextPageToken || null,
        hasMore: Boolean(rawPage.nextPageToken),
      });
    }

    const catalog = await fetchNurBooksCatalog(forceRefresh);

    const sanitizeForRole = (items: DriveBookFile[]): DriveBookFile[] =>
      items.map((item) => ({
        ...item,
        // Never expose external Drive links to students to uphold no-download policy
        webViewLink: isSuper ? item.webViewLink : undefined,
      }));

    let visibleFiles: DriveBookFile[];
    if (effectiveGrade) {
      visibleFiles = sanitizeForRole(catalog.byGrade[String(effectiveGrade) as '9' | '10' | '11' | '12'] || []);
    } else {
      visibleFiles = sanitizeForRole(catalog.allFiles);
    }

    const total = visibleFiles.length;
    const startIdx = (page - 1) * pageSize;
    const pagedFiles = visibleFiles.slice(startIdx, startIdx + pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const filteredByGrade: Record<'9' | '10' | '11' | '12', DriveBookFile[]> = {
      '9': isSuper || effectiveGrade === 9 ? sanitizeForRole(catalog.byGrade['9']) : [],
      '10': isSuper || effectiveGrade === 10 ? sanitizeForRole(catalog.byGrade['10']) : [],
      '11': isSuper || effectiveGrade === 11 ? sanitizeForRole(catalog.byGrade['11']) : [],
      '12': isSuper || effectiveGrade === 12 ? sanitizeForRole(catalog.byGrade['12']) : [],
    };

    return res.json({
      success: true,
      folderId: catalog.folderId,
      folderName: catalog.folderName,
      fetchedAt: catalog.fetchedAt,
      gradeApplied: effectiveGrade,
      page,
      pageSize,
      total,
      totalPages,
      hasMore: startIdx + pagedFiles.length < total,
      nextPage: startIdx + pagedFiles.length < total ? page + 1 : null,
      files: pagedFiles,
      byGrade: filteredByGrade,
      uncategorized: isSuper ? sanitizeForRole(catalog.uncategorized) : [],
    });
  } catch (e: any) {
    console.error('[books drive list]', e?.message || e);
    const httpStatus = typeof e?.httpStatus === 'number' ? e.httpStatus : 502;
    return res.status(httpStatus).json({
      success: false,
      code: e?.code || 'DRIVE_LIST_FAILED',
      error: e?.message || 'መጻሕፍትን ከ Google Drive ማምጣት አልተቻለም።',
      details: e?.details,
    });
  }
});

// ---------------------------------------------------------------------------
// Existing Admin Book Mapping & Scanning Endpoints (Preserved)
// ---------------------------------------------------------------------------

// Super admin: link a book id to a Drive file.
booksRouter.post('/admin/map', requireSuperAdmin, async (req: Request, res: Response) => {
  const bookId = String(req.body?.bookId || '');
  const fileId = parseDriveFileId(req.body?.driveFile);
  if (!BOOK_ID_RE.test(bookId) || !fileId) {
    return res.status(400).json({ success: false, error: 'bookId ወይም የ Drive ፋይል ሊንክ ትክክል አይደለም።' });
  }
  try {
    await adminDb.collection('book_files').doc(bookId).set(
      { driveFileId: fileId, updatedBy: req.user!.uid, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return res.json({ success: true, bookId });
  } catch (e: any) {
    console.error('[books admin/map]', e?.message || e);
    const isPerm = e?.code === 7 || /PERMISSION_DENIED|insufficient permission|default credentials/i.test(String(e?.message || ''));
    return res.status(isPerm ? 503 : 500).json({
      success: false,
      code: isPerm ? 'FIRESTORE_PERMISSION_DENIED' : 'BOOK_MAP_SAVE_FAILED',
      error: isPerm
        ? 'የ Firestore ፈቃድ ችግር አለ (FIRESTORE_SERVICE_ACCOUNT_JSON)።'
        : `ማስቀመጥ አልተቻለም: ${e?.message || 'Unknown Firestore error'}`,
    });
  }
});

// Super admin: list the PDFs inside a Drive folder (folder must be shared with the service account).
booksRouter.post('/admin/scan', requireSuperAdmin, async (req: Request, res: Response) => {
  const folderInput = req.body?.folder ? String(req.body.folder) : getConfiguredRootFolderId();
  const folderId = parseDriveFileId(folderInput);
  if (!folderId) return res.status(400).json({ success: false, error: 'የአቃፊ ሊንክ ትክክል አይደለም።' });
  try {
    const { auth } = getDriveAuthResolution();
    const token = await auth.getAccessToken();
    if (!token) throw new Error('Drive token unavailable');
    const files: Array<{ id: string; name: string; mimeType?: string; size?: string; modifiedTime?: string; webViewLink?: string }> = [];
    let pageToken = '';
    do {
      const q = encodeURIComponent(`'${folderId}' in parents and mimeType='application/pdf' and trashed=false`);
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink)&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const text = await r.text();
      if (!r.ok) {
        const parsed = parseDriveError(r.status, text);
        return res.status(parsed.status).json({ success: false, code: parsed.code, error: parsed.message, details: parsed.details });
      }
      const b: any = JSON.parse(text);
      files.push(...(b.files || []));
      pageToken = b.nextPageToken || '';
    } while (pageToken && files.length < 1000);
    res.json({ success: true, files });
  } catch (e: any) {
    console.error('[books scan]', e?.message || e);
    res.status(502).json({ success: false, error: 'አቃፊውን ማንበብ አልተቻለም። አቃፊው ለ service account (Viewer) መጋራቱንና Drive API መብራቱን ያረጋግጡ።' });
  }
});

// Super admin: save many book -> Drive file links at once.
booksRouter.post('/admin/map-bulk', requireSuperAdmin, async (req: Request, res: Response) => {
  const rawItems = Array.isArray(req.body?.items) ? req.body.items.slice(0, 200) : [];
  const validEntries: Array<{ bookId: string; fileId: string }> = [];
  for (const it of rawItems) {
    const bookId = String(it?.bookId || '');
    const fileId = parseDriveFileId(it?.driveFile);
    if (!BOOK_ID_RE.test(bookId) || !fileId) continue;
    validEntries.push({ bookId, fileId });
  }

  if (validEntries.length === 0) {
    return res.status(400).json({
      success: false,
      code: 'NO_VALID_MAPPINGS',
      error: 'ቢያንስ አንድ ትክክለኛ የመጽሐፍ እና የ Drive PDF መለያ ይምረጡ።',
    });
  }

  try {
    const batch = adminDb.batch();
    const updatedAt = new Date().toISOString();
    for (const { bookId, fileId } of validEntries) {
      const ref = adminDb.collection('book_files').doc(bookId);
      batch.set(
        ref,
        { driveFileId: fileId, updatedBy: req.user!.uid, updatedAt },
        { merge: true }
      );
    }
    await batch.commit();
    return res.json({ success: true, saved: validEntries.length });
  } catch (e: any) {
    console.error('[books admin/map-bulk]', e?.message || e);
    const isPerm = e?.code === 7 || /PERMISSION_DENIED|insufficient permission|default credentials/i.test(String(e?.message || ''));
    return res.status(isPerm ? 503 : 500).json({
      success: false,
      code: isPerm ? 'FIRESTORE_PERMISSION_DENIED' : 'BOOK_MAP_BULK_SAVE_FAILED',
      error: isPerm
        ? 'የ Firestore ፈቃድ ችግር አለ (FIRESTORE_SERVICE_ACCOUNT_JSON)።'
        : `ማስቀመጥ አልተቻለም: ${e?.message || 'Unknown Firestore error'}`,
    });
  }
});

// Super admin: list mapped books.
booksRouter.get('/admin/list', requireSuperAdmin, async (_req: Request, res: Response) => {
  try {
    const snap = await adminDb.collection('book_files').get();
    return res.json({ success: true, books: snap.docs.map((d: any) => ({ bookId: d.id, ...d.data() })) });
  } catch (e: any) {
    console.error('[books admin/list]', e?.message || e);
    return res.status(503).json({
      success: false,
      books: [],
      error: e?.message || 'Failed to read book_files from Firestore',
    });
  }
});

// Which books have a PDF available (so the client can show the PDF reader button).
booksRouter.get('/available', async (_req: Request, res: Response) => {
  try {
    const snap = await adminDb.collection('book_files').get();
    res.json({ success: true, bookIds: snap.docs.map((d: any) => d.id) });
  } catch {
    res.json({ success: true, bookIds: [] });
  }
});

// ---------------------------------------------------------------------------
// Secure Streaming Helper (Shared by Mapped Books & Verified Nur Books PDFs)
// ---------------------------------------------------------------------------

async function streamDrivePdfResponse(fileId: string, req: Request, res: Response) {
  const { auth } = getDriveAuthResolution();
  const token = await auth.getAccessToken();
  if (!token) {
    return res.status(503).json({ success: false, error: 'የ Drive ፈቃድ ችግር (service account)።' });
  }
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (typeof req.headers.range === 'string') headers.Range = req.headers.range;

  const upstream = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`,
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
}

// Stream a PDF directly from the verified Nur Books Drive catalog (plan-checked & grade-locked).
booksRouter.get('/drive/:fileId/file', async (req: Request, res: Response) => {
  const fileId = req.params.fileId;
  if (!FILE_ID_RE.test(fileId)) return res.status(400).json({ success: false, error: 'Bad file id' });

  if (!isPremiumActive(req.user)) {
    return res.status(402).json({ success: false, code: 'SUBSCRIPTION_REQUIRED', error: 'መጽሐፉን ለማንበብ ወርሃዊ ክፍያ ያስፈልጋል።' });
  }

  try {
    let entry = authorizedDriveFiles.get(fileId);
    if (!entry) {
      await fetchNurBooksCatalog(false);
      entry = authorizedDriveFiles.get(fileId);
    }
    if (!entry) {
      return res.status(404).json({ success: false, error: 'ይህ መጽሐፍ በ Nur Books አቃፊ ውስጥ አልተገኘም።' });
    }

    // Strict grade-level check for non-super-admin students
    if (
      req.user?.role !== 'super_admin' &&
      req.user?.grade &&
      entry.grade &&
      req.user.grade !== entry.grade
    ) {
      return res.status(403).json({
        success: false,
        code: 'GRADE_RESTRICTED',
        error: `ይህ መጽሐፍ የ${entry.grade}ኛ ክፍል ነው። ከተመዘገቡበት ክፍል ውጪ መጠቀም አይችሉም።`,
      });
    }

    return await streamDrivePdfResponse(fileId, req, res);
  } catch (e: any) {
    console.error('[books drive stream]', e?.message || e);
    const httpStatus = typeof e?.httpStatus === 'number' ? e.httpStatus : 500;
    if (!res.headersSent) {
      res.status(httpStatus).json({ success: false, error: e?.message || 'መጽሐፉን መጫን አልተቻለም።' });
    }
  }
});

// Stream a mapped book PDF to an entitled student.
booksRouter.get('/:bookId/file', async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  if (!BOOK_ID_RE.test(bookId)) return res.status(400).json({ success: false, error: 'Bad book id' });

  // Plan check (super admin passes inside isPremiumActive).
  if (!isPremiumActive(req.user)) {
    return res.status(402).json({ success: false, code: 'SUBSCRIPTION_REQUIRED', error: 'መጽሐፉን ለማንበብ ወርሃዊ ክፍያ ያስፈልጋል።' });
  }

  // Strict grade-level check for non-super-admin students when bookId encodes grade (e.g., g10-math-tb)
  const bookGradeMatch = bookId.match(/(?:^|[-_])g(?:rade)?(9|10|11|12)(?:[-_]|$)/i);
  if (req.user?.role !== 'super_admin' && req.user?.grade && bookGradeMatch) {
    const targetGrade = Number(bookGradeMatch[1]);
    if (targetGrade !== req.user.grade) {
      return res.status(403).json({
        success: false,
        code: 'GRADE_RESTRICTED',
        error: `ይህ መጽሐፍ የ${targetGrade}ኛ ክፍል ነው። ከተመዘገቡበት ክፍል ውጪ መጠቀም አይችሉም።`,
      });
    }
  }

  try {
    const snap = await adminDb.collection('book_files').doc(bookId).get();
    const fileId = snap.exists ? String(snap.data()?.driveFileId || '') : '';
    if (!FILE_ID_RE.test(fileId)) return res.status(404).json({ success: false, error: 'ይህ መጽሐፍ ገና አልተጫነም።' });

    return await streamDrivePdfResponse(fileId, req, res);
  } catch (e: any) {
    console.error('[books]', e?.message || e);
    const cred = /credential|permission|invalid_grant|scope/i.test(String(e?.message || e));
    if (!res.headersSent) {
      res.status(cred ? 503 : 500).json({ success: false, error: cred ? 'የ Drive ፈቃድ ችግር (service account)።' : 'መጽሐፉን መጫን አልተቻለም።' });
    }
  }
});
