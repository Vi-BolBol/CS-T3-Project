import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import JobCard from '../../components/ui/JobCard';
import CompanyCard from '../../components/ui/CompanyCard';
import useSavedInternships from '../../hooks/useSavedInternships';
import useFollowedCompanies from '../../hooks/useFollowedCompanies';
import useRecommendedInternships from '../../hooks/useRecommendedInternships';

function formatSalary(job) {
  if (job.salaryMin && job.salaryMax) return `$${job.salaryMin}-$${job.salaryMax}/mo`;
  if (job.salary) return `$${job.salary}/mo`;
  return 'Not disclosed';
}

function SectionHeader({ title, actionLabel, actionTo }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="text-xs text-[#10b981] hover:underline">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function EmptyState({ message, actionLabel, actionTo }) {
  return (
    <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800">
      <p className="text-sm text-slate-400">{message}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-block mt-3 text-xs font-semibold text-[#10b981] hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const { savedInternships, loading: savedLoading, fetchSaved } = useSavedInternships();
  const { followedCompanies, loading: followedLoading, fetchFollowed } = useFollowedCompanies();
  const { recommended, loading: recommendedLoading, fetchRecommended } = useRecommendedInternships();

  useEffect(() => {
    fetchSaved();
    fetchFollowed();
    fetchRecommended();
  }, [fetchSaved, fetchFollowed, fetchRecommended]);

  return (
    <div className="min-h-screen bg-[#070B19]">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-12 pb-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-[#070B19] mt-[60px] to-[#11182c] border border-slate-800/80 rounded-3xl p-10 lg:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Find the team where you <span className="text-[#10b981] bg-clip-text">belong</span>.
          </h1>
          <p className="text-slate-400 text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
            Connect your developer profile with leading technology environments looking for software engineering placement candidates.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/user/browse')}
              className="px-8 py-3.5 bg-[#10b981] hover:bg-emerald-600 transition-all font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/40 active:scale-95"
            >
              Explore Available Roles
            </button>
          </div>
        </div>

        {/* Companies You Follow */}
        <div>
          <SectionHeader title="Companies You Follow" actionLabel="Browse Companies" actionTo="/company" />
          {followedLoading && <p className="text-sm text-slate-400">Loading…</p>}
          {!followedLoading && followedCompanies.length === 0 && (
            <EmptyState
              message="You're not following any companies yet."
              actionLabel="Discover companies to follow"
              actionTo="/company"
            />
          )}
          {!followedLoading && followedCompanies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {followedCompanies.map((company) => (
                <Link key={company.id} to={`/company/${company.id}`}>
                  <CompanyCard
                    name={company.companyName}
                    industry={company.industry}
                    location={company.location}
                    jobs={company.openInternshipsCount}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Saved Internships */}
        <div>
          <SectionHeader title="Saved Internships" actionLabel="Find more internships" actionTo="/user/browse" />
          {savedLoading && <p className="text-sm text-slate-400">Loading…</p>}
          {!savedLoading && savedInternships.length === 0 && (
            <EmptyState
              message="You haven't saved any internships yet."
              actionLabel="Browse internships"
              actionTo="/user/browse"
            />
          )}
          {!savedLoading && savedInternships.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedInternships.map((job) => (
                <Link key={job.id} to={`/company/${job.companyId}`}>
                  <JobCard
                    title={job.title}
                    company={job.company?.companyName}
                    location={job.location}
                    type={job.workEnvironment}
                    salary={formatSalary(job)}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recommended For You */}
        <div>
          <SectionHeader title="Recommended For You" actionLabel="See all internships" actionTo="/user/browse" />
          {recommendedLoading && <p className="text-sm text-slate-400">Loading…</p>}
          {!recommendedLoading && recommended.length === 0 && (
            <EmptyState message="No recommendations yet — check back soon." />
          )}
          {!recommendedLoading && recommended.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommended.map((job) => (
                <Link key={job.id} to={`/company/${job.companyId}`}>
                  <JobCard
                    title={job.title}
                    company={job.company?.companyName}
                    location={job.location}
                    type={job.workEnvironment}
                    salary={formatSalary(job)}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
