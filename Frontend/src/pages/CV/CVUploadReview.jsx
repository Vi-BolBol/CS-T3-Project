import { useEffect } from 'react';
import { saveCvToServer } from '../../hooks/useCvStatus';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';

// Shown right after a PDF upload is parsed. Lets the user see what was
// extracted and choose whether to convert it into an editable CV using
// the builder's format (recommended — this is what unlocks Scoring,
// Edit Content, and re-download elsewhere in the app) or discard it.
function CVUploadReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updatePersonal, updateAbout, updateExperience, markStepComplete } = useCVBuilder();

  const parsed = location?.state?.parsed;

  // If someone lands here directly (e.g. page refresh) there's no parsed
  // data to show — bounce back to the upload/choice screen instead of
  // rendering a broken page.
  useEffect(() => {
    if (!parsed) {
      navigate('/cv', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed]);

  if (!parsed) return null;

  const { personal, about, experience } = parsed;

  const handleConvert = async () => {
    if (personal) updatePersonal(personal);
    if (about) updateAbout(about);
    if (experience) updateExperience(experience);

    // Mark whichever steps now have real content as complete, so the
    // dashboard's completion gate and Edit Content checklist reflect
    // what was actually recovered from the PDF.
    if (personal?.fullName) markStepComplete(2);
    if (about?.aboutMe || about?.skills?.length) markStepComplete(3);
    if (experience?.workExperience?.length || experience?.education?.length) markStepComplete(4);

    // Save the freshly parsed data directly — React state updates above are
    // async, so `cvData` would still hold the previous (empty) value here.
    await saveCvToServer({
      ...cvData,
      ...(personal ? { personal } : {}),
      ...(about ? { about } : {}),
      ...(experience ? { experience } : {}),
    });
    navigate('/cv/manage');
  };

  const handleDiscard = () => {
    navigate('/cv');
  };

  const hasWork = experience?.workExperience?.length > 0;
  const hasEducation = experience?.education?.length > 0;
  const hasLinks = about?.links?.length > 0;
  const hasReferences = experience?.references?.length > 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface text-content flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Here's what we found</h1>
          <p className="text-subtle">
            Review the details we pulled from your PDF. Converting it into an editable CV
            unlocks scoring, suggestions, and easy edits — the same tools available to CVs
            built directly in our builder.
          </p>
        </div>

        <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-6 flex flex-col gap-5 mb-8">

          {/* Personal */}
          <div>
            <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">Personal Info</h2>
            <p className="text-lg font-bold">{personal?.fullName || 'Name not found'}</p>
            <p className="text-sm text-subtle mt-0.5">
              {[personal?.email, personal?.phoneNumber, personal?.location].filter(Boolean).join('  ·  ') || 'No contact details found'}
            </p>
          </div>

          {/* About */}
          {about?.aboutMe && (
            <div className="pt-4 border-t border-line/80">
              <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">About Me</h2>
              <p className="text-sm text-subtle leading-relaxed">{about.aboutMe}</p>
            </div>
          )}

          {/* Skills */}
          {about?.skills?.length > 0 && (
            <div className="pt-4 border-t border-line/80">
              <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {about.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-muted/60 rounded-full text-xs text-content">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work experience */}
          <div className="pt-4 border-t border-line/80">
            <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
              Work Experience {hasWork && `(${experience.workExperience.length})`}
            </h2>
            {hasWork ? (
              <div className="flex flex-col gap-2">
                {experience.workExperience.map((job, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold text-content">{job.jobTitle}</span>
                    {job.company && <span className="text-subtle"> — {job.company}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-faint italic">None found</p>
            )}
          </div>

          {/* Education */}
          <div className="pt-4 border-t border-line/80">
            <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
              Education {hasEducation && `(${experience.education.length})`}
            </h2>
            {hasEducation ? (
              <div className="flex flex-col gap-2">
                {experience.education.map((edu, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold text-content">{edu.institution}</span>
                    {edu.degree && <span className="text-subtle"> — {edu.degree}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-faint italic">None found</p>
            )}
          </div>

          {/* Links */}
          {hasLinks && (
            <div className="pt-4 border-t border-line/80">
              <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Links ({about.links.length})
              </h2>
              <div className="flex flex-col gap-1">
                {about.links.map((link, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold text-content">{link.label || 'Link'}</span>
                    <span className="text-subtle"> — {link.url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {hasReferences && (
            <div className="pt-4 border-t border-line/80">
              <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                References ({experience.references.length})
              </h2>
              <div className="flex flex-col gap-2">
                {experience.references.map((ref, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold text-content">{ref.fullName}</span>
                    {ref.company && <span className="text-subtle"> — {ref.company}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-faint text-center mb-6">
          Note: a photo isn't extracted from uploaded PDFs — you can add one from the builder after converting.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDiscard}
            className="px-6 py-2.5 border border-line text-content text-sm font-semibold rounded-lg hover:bg-muted/60 transition"
          >
            Discard
          </button>
          <button
            onClick={handleConvert}
            className="px-6 py-2.5 bg-accent text-accent-ink text-sm font-bold rounded-lg hover:bg-accent transition shadow-md shadow-accent/20"
          >
            Convert to Editable CV →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVUploadReview;