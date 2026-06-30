import { formatTimelineDate } from '../../../utils/dateFormatter';

function ResumeTemplate({ data = {} }) {
  // Fail-safe defaults matching empty inputs
  const {
    firstName = 'John',
    lastName = 'Doe',
    biography = 'Software Engineering Student',
    experience = [
      { role: 'Frontend Intern', company: 'Tech Corp', startDate: '2025-01-01', endDate: '' }
    ]
  } = data;

  return (
    <div id="resume-sheet" className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-12 shadow-2xl mx-auto text-left font-sans">
      {/* Header Grid */}
      <div className="border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase text-slate-800">
          {firstName} <span className="text-emerald-600">{lastName}</span>
        </h1>
        <p className="mt-2 text-slate-600 max-w-xl text-sm leading-relaxed">{biography}</p>
      </div>

      {/* Experience block section */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">Work Experience</h2>
        <div className="space-y-4">
          {experience.map((job, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{job.role}</h3>
                <p className="text-sm text-slate-500">{job.company}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {formatTimelineDate(job.startDate)} — {formatTimelineDate(job.endDate)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResumeTemplate;