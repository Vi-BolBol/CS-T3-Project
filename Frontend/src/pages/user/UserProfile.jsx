import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import Toast from '../../components/shared/Toast';
import useCvStatus from '../../hooks/useCvStatus';
import useToast from '../../hooks/useToast';
import ImageUploadField from '../../components/shared/ImageUploadField';
import { getMyStudentProfile, updateMyStudentProfile, getStudentProfileById } from '../../api/studentApi';

/* One component, two modes:
   /user/profile      -> own profile  (edit, share, view-as-public)
   /user/profile/:id  -> someone else -> read-only

   Backed by GET/PUT /api/student/profile and GET /api/student/profile/:id.
   It previously lived in localStorage only, which meant the profile never
   followed the student to another device AND — the worse half — a company
   opening an applicant's profile was shown its own cached one, because there
   was no way to fetch anybody else's. localStorage is now only a fast first
   paint for the owner; the server is the source of truth. */
const KEY = 'if-student-profile';

const EMPTY = {
  fullName: '', headline: '', role: '', bio: '', location: '',
  email: '', phone: '', university: '', skills: '', portfolio: '',
  photo: null, cover: null,
};

// Suggested roles — the headline is free text, these are just quick picks.
const ROLE_OPTIONS = [
  'Software Engineering Intern', 'Frontend Developer Intern', 'Backend Developer Intern',
  'Data Analyst Intern', 'UX/UI Design Intern', 'Accounting Intern', 'Finance Intern',
  'Marketing Intern', 'Human Resources Intern', 'Business Analyst Intern',
  'Cybersecurity Intern', 'QA / Testing Intern', 'Project Management Intern',
];

const COVERS = [
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #84cc16 100%)',
];

const readProfile = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...EMPTY }; }
};

/* StudentProfile has fewer columns than this page shows. The extras (headline,
   role, portfolio, cover) have no home in the schema, so they stay local while
   everything the server does store round-trips properly. */
const fromServer = (p, local = {}) => ({
  ...EMPTY,
  ...local,
  fullName: p?.fullName ?? local.fullName ?? '',
  bio: p?.bio ?? local.bio ?? '',
  university: p?.education ?? local.university ?? '',
  skills: p?.skills ?? local.skills ?? '',
  phone: p?.phone ?? local.phone ?? '',
  email: p?.user?.email ?? local.email ?? '',
  photo: p?.profileImage ?? local.photo ?? null,
});

const toServer = (d) => ({
  fullName: d.fullName || null,
  bio: d.bio || null,
  education: d.university || null,
  skills: d.skills || null,
  phone: d.phone || null,
  profileImage: d.photo || null,
});

const inputCls =
  'w-full rounded-lg border border-line bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:border-accent focus:outline-none';

export default function UserProfile() {
  const { id } = useParams();          // present => viewing someone else
  const isOwner = !id;
  const navigate = useNavigate();

  /*
    Companies and admins reach this page from an applicant row or the user table.
    It used to render the STUDENT navbar for them regardless of who was looking,
    which meant a company reviewing an applicant saw student navigation and had
    no way back to where they came from. The company shell supplies its own
    navbar, so here we only render one when the viewer is a student.
  */
  let viewerRole = null;
  try { viewerRole = JSON.parse(localStorage.getItem('user') || 'null')?.role || null; }
  catch { viewerRole = null; }
  const viewerIsStudent = viewerRole === 'student';

  const { message: toastMessage, showToast, clearToast } = useToast();
  const { hasCv, syncedToProfile, markCvSynced, getCvAsProfile } = useCvStatus();

  const [profile, setProfile] = useState(readProfile);
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [previewPublic, setPreviewPublic] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (isOwner) {
        // Paint from the local mirror first so the page isn't blank, then
        // reconcile with the server.
        const local = readProfile();
        setProfile(local);
        setDraft(local);
        const res = await getMyStudentProfile();
        if (!cancelled && res.success && res.profile) {
          const merged = fromServer(res.profile, local);
          setProfile(merged);
          setDraft(merged);
          try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch { /* quota */ }
        }
      } else {
        // Somebody else's profile: never fall back to the local mirror, or the
        // viewer would be shown their own details under another person's name.
        const res = await getStudentProfileById(id);
        if (!cancelled) {
          if (res.success && res.profile) setProfile(fromServer(res.profile));
          else { setProfile({ ...EMPTY }); showToast(res.message || 'Profile not found.'); }
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isOwner]);

  const save = async () => {
    // Mirror locally first so the edit survives a failed request.
    try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch { /* quota */ }
    setProfile(draft);
    setEditing(false);

    const res = await updateMyStudentProfile(toServer(draft));
    showToast(res.success ? 'Profile updated.' : (res.message || 'Saved on this device only.'));
  };

  const share = async () => {
    const url = `${window.location.origin}/user/profile/${id || 'me'}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Profile link copied to clipboard.');
    } catch {
      showToast(url);
    }
  };

  // Real sync: pull the saved CV into the profile fields.
  // (Previously this only flipped a flag and copied nothing — that was the bug.)
  const syncFromCv = () => {
    const fromCv = getCvAsProfile();
    if (!fromCv) {
      showToast('No saved CV found. Build or upload one first.');
      return;
    }
    // Only fill fields the CV actually has; never blank out existing profile data.
    const merged = { ...profile };
    Object.entries(fromCv).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') merged[k] = v;
    });
    // The CV's photo is the natural profile picture — map it across rather than
    // leaving `photo` as an orphan key the profile UI never reads.
    if (fromCv.photo) merged.photo = fromCv.photo;
    localStorage.setItem(KEY, JSON.stringify(merged));
    setProfile(merged);
    setDraft(merged);
    markCvSynced();
    // Push it to the server as well, or the sync would vanish on next load.
    updateMyStudentProfile(toServer(merged));
    showToast('CV synced — your profile has been filled in.');
  };

  const readOnly = !isOwner || previewPublic;
  const skills = (profile.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className={`flex flex-col bg-surface ${viewerIsStudent ? "min-h-screen" : "flex-1"}`}>
      {viewerIsStudent && <Navbar />}

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Viewing someone else's profile is always a detour from somewhere —
            an applicant row, a search result, the admin user table. Without a
            way back, the only escape was the browser button. */}
        {!isOwner && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-subtle transition hover:text-content"
          >
            <i className="bi bi-arrow-left" /> Back
          </button>
        )}

        {/* CV sync prompt — owner only */}
        {isOwner && hasCv && !syncedToProfile && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <i className="bi bi-arrow-repeat mt-0.5 text-accent" />
              <div>
                <p className="text-sm font-bold text-content">Sync your CV with this profile</p>
                <p className="text-xs text-subtle">Reuse your CV details instead of typing them again.</p>
              </div>
            </div>
            <button onClick={syncFromCv} className="flex-shrink-0 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
              Sync now
            </button>
          </div>
        )}

        {previewPublic && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-line bg-muted px-4 py-2">
            <p className="text-xs text-subtle"><i className="bi bi-eye mr-1.5" />This is how others see your profile.</p>
            <button onClick={() => setPreviewPublic(false)} className="text-xs font-semibold text-accent hover:underline">
              Exit preview
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-line bg-raised">
          {/* Cover banner */}
          <div
            className="relative h-40 sm:h-52"
            style={{ background: profile.cover || COVERS[0] }}
          >
            {isOwner && !previewPublic && !editing && (
              <button
                onClick={() => {
                  const i = COVERS.indexOf(profile.cover);
                  const next = COVERS[(i + 1) % COVERS.length];
                  const updated = { ...profile, cover: next };
                  localStorage.setItem(KEY, JSON.stringify(updated));
                  setProfile(updated);
                  setDraft(updated);
                }}
                title="Change cover"
                aria-label="Change cover background"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
              >
                <i className="bi bi-image text-sm" />
              </button>
            )}
          </div>

          <div className="px-6 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative z-10 flex items-end gap-4">
              <div className="relative -mt-12 flex-shrink-0">
                {/* Online ring: pulsing accent glow behind the avatar */}
                <span className="absolute inset-0 animate-pulse rounded-full bg-accent/30 blur-md" aria-hidden="true" />

                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt=""
                    className="relative h-24 w-24 rounded-full border-4 border-raised object-cover shadow-lg ring-2 ring-accent"
                  />
                ) : (
                  <span className="relative grid h-24 w-24 place-items-center rounded-full border-4 border-raised bg-accent-soft text-3xl font-black text-accent shadow-lg ring-2 ring-accent">
                    {(profile.fullName || 'S').charAt(0).toUpperCase()}
                  </span>
                )}

                {/* Online dot */}
                <span
                  title="Online"
                  className="absolute bottom-1 right-1 z-10 h-5 w-5 rounded-full border-4 border-raised bg-accent"
                />
              </div>
              <div className="min-w-0 pb-1.5">
                <h1 className="truncate text-xl font-black text-content">
                  {profile.fullName || (isOwner ? 'Your name' : 'Student')}
                </h1>
                <p className="truncate text-sm text-accent">
                  {profile.role || profile.headline || 'Add your target role'}
                </p>
                {profile.headline && profile.role && (
                  <p className="truncate text-xs text-subtle">{profile.headline}</p>
                )}
                {profile.location && (
                  <p className="mt-0.5 text-xs text-faint"><i className="bi bi-geo-alt mr-1" />{profile.location}</p>
                )}
              </div>
            </div>

            {/* Owner controls */}
            {isOwner && !previewPublic && (
              <div className="flex flex-shrink-0 flex-wrap gap-2 pb-1 sm:pt-4">
                {!editing && (
                  <button
                    onClick={() => { setDraft(profile); setEditing(true); }}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-ink transition hover:opacity-90"
                  >
                    <i className="bi bi-pencil mr-1" /> Edit
                  </button>
                )}
                <button
                  onClick={() => setPreviewPublic(true)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-content"
                >
                  <i className="bi bi-eye mr-1" /> View
                </button>
                <button
                  onClick={share}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-content"
                >
                  <i className="bi bi-share mr-1" /> Share
                </button>
              </div>
            )}
          </div>

          {/* Edit form */}
          {isOwner && editing && !previewPublic ? (
            <div className="mt-8 space-y-3 border-t border-line pt-6">
              {/* Profile picture. There was no way to set one at all before —
                  the avatar could only ever be initials or whatever the CV
                  sync happened to carry across. */}
              <ImageUploadField
                label="Profile picture"
                shape="circle"
                value={draft.photo}
                fallback={draft.fullName || 'S'}
                onChange={(v) => setDraft({ ...draft, photo: v })}
                hint="Shown to companies reviewing your application. JPG or PNG, up to 5 MB."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Full name</label>
                  <input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} className={inputCls} placeholder="Your full name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Phone</label>
                  <input value={draft.phone || ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputCls} placeholder="+855 ..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Target role</label>
                  <input
                    list="role-options"
                    value={draft.role}
                    onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Accounting Intern"
                  />
                  <datalist id="role-options">
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r} />)}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Headline</label>
                  <input value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} className={inputCls} placeholder="e.g. CS student at CADT" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Location</label>
                  <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={inputCls} placeholder="Phnom Penh, Cambodia" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">University</label>
                  <input value={draft.university} onChange={(e) => setDraft({ ...draft, university: e.target.value })} className={inputCls} placeholder="CADT" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Contact email</label>
                  <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Portfolio / GitHub</label>
                  <input value={draft.portfolio} onChange={(e) => setDraft({ ...draft, portfolio: e.target.value })} className={inputCls} placeholder="https://github.com/you" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Skills (comma separated)</label>
                <input value={draft.skills} onChange={(e) => setDraft({ ...draft, skills: e.target.value })} className={inputCls} placeholder="React, Node.js, SQL" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">About</label>
                <textarea rows={4} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className={inputCls} placeholder="A short introduction for companies." />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={save} className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:opacity-90">
                  Save changes
                </button>
                <button onClick={() => setEditing(false)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-subtle transition hover:text-content">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Read view — shared by public visitors and the owner's preview */
            <div className="mt-8 space-y-6 border-t border-line pt-6">
              <div>
                <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">About</h2>
                <p className="text-sm text-subtle">
                  {profile.bio || 'No introduction added yet.'}
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-faint">Skills</h2>
                {skills.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="rounded-md border border-line px-2 py-0.5 text-xs text-subtle">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-subtle">No skills listed yet.</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">University</h2>
                  <p className="text-sm text-subtle">{profile.university || '—'}</p>
                </div>
                <div>
                  <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">Contact</h2>
                  <p className="truncate text-sm text-subtle">{profile.email || '—'}</p>
                </div>
              </div>

              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  <i className="bi bi-box-arrow-up-right" /> Portfolio
                </a>
              )}

              {isOwner && !previewPublic && !hasCv && (
                <div className="rounded-lg border border-dashed border-line p-4 text-center">
                  <p className="text-xs text-subtle">
                    You don't have a CV yet.{' '}
                    <Link to="/cv" className="font-semibold text-accent hover:underline">Build or upload one</Link>{' '}
                    to strengthen your profile.
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        </section>
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
