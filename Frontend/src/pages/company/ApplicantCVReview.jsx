import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  // Any status past `pending` means the CV has been opened and reviewed at
  // least once, so a decided application keeps its buttons visible.
  const hasReviewed = applicant
    ? ['reviewed', 'accepted', 'rejected'].includes(applicant.status)
    : false;

  const TemplateComponent = applicant ? TEMPLATE_COMPONENTS[applicant.template] || ClassicTemplate : null;

  return (
    <div className="flex flex-1 flex-col bg-surface text-content">

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs text-subtle hover:text-content transition mb-6 inline-flex items-center gap-1"
        >
          &larr; Back
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
                  <div className="min-w-0">
                    <h1 className="truncate text-base font-bold text-content">{applicant.name}</h1>
                    <p className="truncate text-xs text-subtle">{applicant.role}</p>
                    {applicant.studentId && (
                      <Link
                        to={`/company/applicant/${applicant.studentId}/profile`}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                      >
                        View full profile <i className="bi bi-arrow-right text-[9px]" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs text-subtle">
                  <div className="flex justify-between">
                    <span>School</span>
                    <span className="text-content">{applicant.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-content capitalize">{applicant.status}</span>
                  </div>
                </div>
              </div>

              {/*
                Accept / Reject are gated behind "Reviewed CV".

                A decision is a real message to a student — accepted or rejected
                lands in their notifications and on their applications page. It
                should not be one stray click away from a list. Marking the CV
                reviewed is an explicit statement that someone actually opened
                and read it, and only then do the decision buttons unlock.

                `reviewed` was already in the ApplicationStatus enum and already
                accepted by the API, so this needed no schema change.
              */}
              <div className="space-y-2 rounded-2xl border border-line bg-raised p-5">
                {!hasReviewed ? (
                  <>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange('reviewed')}
                      className="w-full rounded-xl bg-accent py-2.5 text-xs font-bold text-accent-ink transition hover:opacity-90 disabled:opacity-40"
                    >
                      <i className="bi bi-check2-square mr-1" /> Reviewed CV
                    </button>
                    <p className="pt-1 text-center text-[11px] leading-relaxed text-faint">
                      Mark this CV as reviewed to unlock Accept and Reject.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="pb-1 text-center text-[11px] font-semibold text-accent">
                      <i className="bi bi-check-circle mr-1" /> CV reviewed
                    </p>
                    <button
                      type="button"
                      disabled={isProcessing || applicant.status === 'accepted'}
                      onClick={() => handleStatusChange('accepted')}
                      className="w-full rounded-xl bg-accent py-2.5 text-xs font-bold text-accent-ink transition hover:opacity-90 disabled:opacity-40"
                    >
                      {applicant.status === 'accepted' ? 'Accepted' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing || applicant.status === 'rejected'}
                      onClick={() => handleStatusChange('rejected')}
                      className="w-full rounded-xl border border-rose-500/20 bg-rose-500/5 py-2.5 text-xs text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-40"
                    >
                      {applicant.status === 'rejected' ? 'Rejected' : 'Reject'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* CV render */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-line bg-raised p-4 sm:p-6 shadow-2xl overflow-x-auto">
                {applicant.hasCv ? (
                  <div className="mx-auto w-fit shadow-2xl">
                    <TemplateComponent cvData={applicant.cvData} palette={applicant.palette} />
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <i className="bi bi-file-earmark-x text-3xl text-faint" />
                    <p className="mt-3 text-sm font-semibold text-content">
                      This applicant has not attached a CV
                    </p>
                    <p className="mt-1 text-xs text-subtle">
                      They applied before saving one, or removed it afterwards.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
