import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Clock, Users } from "lucide-react";
import Navbar from "../../components/layout/StudentNavbar";
import Footer from "../../components/layout/StudentFooter";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import usePublicInternships from "../../hooks/usePublicInternships";
import useApplications from "../../hooks/useApplications";

export default function ViewDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchInternships, getInternshipById, loading } = usePublicInternships();
  const { applyToInternship, loading: applying } = useApplications();

  const [listings, setListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');

  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const directId = searchParams.get('id');

  useEffect(() => {
    let cancelled = false;
    setLoadError('');
    setApplyMessage('');

    // Deep-link to one specific internship (e.g. from a "Quick Apply" card)
    if (directId) {
      getInternshipById(Number(directId)).then((result) => {
        if (cancelled) return;
        if (result.success) {
          setListings([result.listing]);
          setSelectedJob(result.listing);
        } else {
          setLoadError(result.message);
        }
      });
      return () => { cancelled = true; };
    }

    searchInternships({ search, location }).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setListings(result.listings);
        setSelectedJob(result.listings[0] || null);
      } else {
        setLoadError(result.message);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location, directId]);

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplyMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setApplyMessage('Please sign in as a student to apply.');
      return;
    }

    const result = await applyToInternship(selectedJob.raw.id);
    if (result.success) {
      setApplyMessage('Application submitted! Track its status on your Applications page.');
    } else {
      setApplyMessage(result.message || 'Failed to submit application.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-greenMain selection:text-darkBlue">
      <div>
        <Navbar />

        {/* Global Page Header Block */}
        <div className="border-b border-white/5 bg-[#0B132B]/40 py-8 backdrop-blur-sm">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-5">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {search || location ? 'Search Results' : 'Open Opportunities'}
              </h1>
              <p className="mt-1 text-sm text-gray-400 max-w-2xl">
                {search && `Role: "${search}" `}
                {location && `· Location: "${location}"`}
                {!search && !location && 'Browse every internship currently open across all companies.'}
              </p>
            </div>
          </main>
        </div>

        {/* Master-Detail Interactive Content Hub */}
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-sm text-gray-400">Loading internships…</div>
          ) : loadError ? (
            <div className="text-center py-20 text-sm text-rose-400">{loadError}</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 space-y-2">
              <p className="text-sm text-gray-400">No internships match your search.</p>
              <button
                type="button"
                onClick={() => navigate('/view-detail')}
                className="text-xs text-greenMain font-bold hover:text-emerald-400 transition"
              >
                Clear filters and browse all open roles ›
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* LEFT COLUMN: Open Positions Sidebar List */}
              <section className="lg:col-span-4 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
                <div className="pb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-greenMain">Open Opportunities</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">{listings.length} role{listings.length === 1 ? '' : 's'} currently active</p>
                </div>

                {listings.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setApplyMessage(''); }}
                      className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-greenMain/40 bg-[#111B34] shadow-lg shadow-black/30"
                          : "border-white/5 bg-[#111B34]/40 hover:border-white/10 hover:bg-[#111B34]/80"
                      }`}
                    >
                      <button type="button" className="absolute top-4 right-4 text-xs text-gray-500 hover:text-greenMain transition" title="Bookmark this position">
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-start gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${job.color}`}>
                          {job.initial}
                        </div>
                        <div className="pr-4">
                          <h3 className="text-sm font-semibold tracking-tight text-white group-hover:text-greenMain transition line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">{job.company}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-1 text-[11px] text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 inline" /> {job.location} <span className="text-white/10 mx-1">|</span> <Clock className="h-3 w-3 inline" /> {job.duration}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-greenMain">{job.salary}</span>
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wide">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* RIGHT COLUMN: Selected Role Detail View */}
              {selectedJob && (
                <section className="lg:col-span-8">
                  <Card className="border border-white/10 bg-[#111B34]/60 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-black/40">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${selectedJob.color} border border-white/5`}>
                          {selectedJob.initial}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{selectedJob.title}</h2>
                          <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
                            {selectedJob.company} <span className="h-1 w-1 rounded-full bg-white/20"></span> {selectedJob.location}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            Posted {selectedJob.postedDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Type</p>
                        <p className="mt-1 text-sm font-bold text-greenMain">{selectedJob.type}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Duration</p>
                        <p className="mt-1 text-sm font-bold text-white">{selectedJob.duration}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Salary</p>
                        <p className="mt-1 text-sm font-bold text-white">{selectedJob.salary}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Applicants</p>
                        <p className="mt-1 text-sm font-bold text-white flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selectedJob.applicants} applied</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">About the Role</h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400 font-normal">
                        {selectedJob.desc}
                      </p>
                    </div>

                    {selectedJob.requirements.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Requirements</h3>
                        <ul className="mt-3 space-y-2 text-xs text-gray-400 list-disc list-inside">
                          {selectedJob.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                      </div>
                    )}

                    {selectedJob.skills.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, i) => (
                          <span key={i} className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                      <Button
                        onClick={handleApply}
                        disabled={applying}
                        className="flex-1 py-3.5 text-sm font-semibold tracking-wide bg-greenMain text-darkBlue hover:bg-greenMain/90 rounded-xl transition shadow-lg shadow-greenMain/10 disabled:opacity-50"
                      >
                        {applying ? 'Submitting…' : 'Apply Now'}
                      </Button>
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                        title="Bookmark this position"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {applyMessage && (
                      <p className={`mt-3 text-xs font-medium ${applyMessage.startsWith('Application submitted') ? 'text-greenMain' : 'text-rose-400'}`}>
                        {applyMessage}
                      </p>
                    )}

                  </Card>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
