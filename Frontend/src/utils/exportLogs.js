/*
  Turning audit logs into a file the admin can keep.

  Both formats are generated in the browser from the rows already on screen —
  no extra endpoint, and what you download is exactly what you filtered.
*/

/**
 * Escapes one CSV field.
 *
 * Excel and Sheets both treat a leading =, +, -, or @ as the start of a formula,
 * so an audit entry could in principle execute something when the file is
 * opened. Prefixing with an apostrophe neutralises that — this is a security
 * export, and it would be embarrassing for it to be the attack.
 */
function csvField(value) {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

const COLUMNS = [
  { key: 'id',         label: 'ID',        get: (l) => l.id },
  { key: 'timestamp',  label: 'Timestamp', get: (l) => new Date(l.createdAt).toISOString() },
  { key: 'local',      label: 'Local time',get: (l) => new Date(l.createdAt).toLocaleString() },
  { key: 'action',     label: 'Action',    get: (l) => l.action },
  { key: 'email',      label: 'User email',get: (l) => l.user?.email || 'deleted user' },
  { key: 'role',       label: 'Role',      get: (l) => l.user?.role || '' },
  { key: 'userId',     label: 'User ID',   get: (l) => l.userId ?? '' },
  { key: 'entityType', label: 'Entity',    get: (l) => l.entityType || '' },
  { key: 'entityId',   label: 'Entity ID', get: (l) => l.entityId ?? '' },
];

export function logsToCsv(logs = []) {
  const header = COLUMNS.map((c) => csvField(c.label)).join(',');
  const rows = logs.map((l) => COLUMNS.map((c) => csvField(c.get(l))).join(','));
  // \r\n and a BOM: Excel opens UTF-8 as the local codepage otherwise, which
  // mangles any non-ASCII name in the export.
  return '\uFEFF' + [header, ...rows].join('\r\n');
}

export function logsToTxt(logs = [], meta = {}) {
  const pad = (s, n) => String(s).padEnd(n);
  const lines = [
    'Internship Finder — audit log export',
    `Generated: ${new Date().toLocaleString()}`,
    `Entries:   ${logs.length}`,
  ];

  if (meta.filterSummary) lines.push(`Filters:   ${meta.filterSummary}`);
  lines.push('', '='.repeat(110), '');

  logs.forEach((l) => {
    const when = new Date(l.createdAt).toLocaleString();
    const who = l.user?.email || 'deleted user';
    const role = l.user?.role ? ` (${l.user.role})` : '';
    const entity = l.entityType
      ? `${l.entityType}${l.entityId ? ` #${l.entityId}` : ''}`
      : '—';
    lines.push(`${pad(when, 24)} ${pad(l.action, 26)} ${pad(who + role, 34)} ${entity}`);
  });

  lines.push('', '='.repeat(110), `End of export — ${logs.length} entr${logs.length === 1 ? 'y' : 'ies'}.`);
  return lines.join('\n');
}

/** Triggers a browser download without touching the server. */
export function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** `audit-logs_2026-07-18_2013.csv` — sorts chronologically in a file manager. */
export function exportFilename(ext) {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `audit-logs_${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}.${ext}`;
}
