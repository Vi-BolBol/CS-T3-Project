import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import CompanyFooter from '../../components/layout/CompanyFooter';
import ClassicTemplate from '../../components/cv/templates/ClassicTemplate';
import ModernTemplate from '../../components/cv/templates/ModernTemplate';
import ProfessionalTemplate from '../../components/cv/templates/ProfessionalTemplate';
import useApplications from '../../hooks/useApplications';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
};

export default function ApplicantCVReview() {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const { fetchApplicantCV, dispatchApplicationStatus, isProcessing } = useApplications();

  const [applicant, setApplicant] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchApplicantCV(applicantId).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setApplicant(result.applicant);
      } else {
        setNotFound(true);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]);

  const handleStatusChange = async (targetStatus) => {
    const success = await dispatchApplicationStatus(applicantId, targetStatus);
    if (success) {
      setApplicant((prev) => (prev ? { ...prev, status: targetStatus } : prev));
    }
  };

  const TemplateComponent = applicant ? TEMPLATE_COMPONENTS[applicant.template] || ClassicTemplate : null;

  return (
    <div className="min-h-screen bg-surface text-content flex flex-col justify-between selection:bg-accent selection:text-accent-ink">
      <CompanyNavbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs text-subtle hover:text-content transition mb-6 inline-flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </button>

        {notFound ? (
          <div className="rounded-2xl border border-line bg-raised p-12 text-center text-sm text-subtle">
            Applicant not found.
          </div>
        ) : !applicant ? (
          <div className="rounded-2xl border border-line bg-raised p-12 text-center text-sm text-subtle">
            Loading CV…
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Candidate summary + actions */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-line bg-raised p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-teal-500/20 border border-accent/20 flex items-center justify-center font-black text-sm text-accent">
                    {applicant.avatar}
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-content">{applicant.name}</h1>
                    <p className="text-xs text-subtle">{applicant.role}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs text-subtle">
                  <div className="flex justify-between">
                    <span>School</span>
                    <span className="text-content">{applicant.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Match Score</span>
                    <span className="text-accent font-bold">{applicant.matchScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-content capitalize">{applicant.status}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-raised p-5 space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleStatusChange('accepted')}
                  className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent text-accent-ink text-xs font-bold transition disabled:opacity-40"
                >
                  Shortlist Candidate
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleStatusChange('reviewed')}
                  className="w-full py-2.5 rounded-xl border border-line bg-raised/5 text-xs text-subtle hover:bg-raised/10 transition disabled:opacity-40"
                >
                  Mark as Reviewed
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleStatusChange('rejected')}
                  className="w-full py-2.5 rounded-xl border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 text-xs transition disabled:opacity-40"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* CV render */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-line bg-raised p-4 sm:p-6 shadow-2xl overflow-x-auto">
                <div className="mx-auto w-fit shadow-2xl">
                  <TemplateComponent cvData={applicant.cvData} palette={applicant.palette} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CompanyFooter />
    </div>
  );
}
