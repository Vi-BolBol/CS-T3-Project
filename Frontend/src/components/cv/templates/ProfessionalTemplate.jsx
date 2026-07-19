function ProfessionalTemplate({ cvData, palette }) {
  const { personal, about, experience } = cvData;
  const photo = cvData.photo;

  return (
    <div
      id="cv-preview"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: 'white',
        boxSizing: 'border-box',
      }}
    >
      {/* Header band */}
      <div style={{
        backgroundColor: palette.dark,
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxSizing: 'border-box',
      }}>
        {photo && (
          <img
            src={photo}
            alt="Profile"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${palette.primary}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '8px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}>
            {personal?.fullName || 'Your Name'}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            {personal?.email && (
              <HeaderContact icon="✉" text={personal.email} palette={palette} />
            )}
            {personal?.phoneNumber && (
              <HeaderContact icon="📞" text={personal.phoneNumber} palette={palette} />
            )}
            {personal?.location && (
              <HeaderContact icon="📍" text={personal.location} palette={palette} />
            )}
          </div>
        </div>
      </div>

      {/* Two column body */}
      <div style={{
        display: 'flex',
        padding: '32px 40px',
        gap: '32px',
        boxSizing: 'border-box',
      }}>

        {/* Left column */}
        <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

          {/* About Me */}
          {about?.aboutMe && (
            <div>
              <SectionTitle title="About Me" palette={palette} />
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7', marginTop: '8px' }}>
                {about.aboutMe}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experience?.workExperience?.length > 0 && (
            <div>
              <SectionTitle title="Work Experience" palette={palette} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                {experience.workExperience.map((job, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#1E293B', wordBreak: 'break-word' }}>{job.jobTitle}</div>
                        <div style={{ color: palette.primary, fontSize: '12px' }}>{job.company}</div>
                        {job.location && (
                          <div style={{ color: '#94A3B8', fontSize: '11px' }}>{job.location}</div>
                        )}
                      </div>
                      <div style={{ color: '#94A3B8', fontSize: '11px', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {job.startMonth} {job.startYear} —{' '}
                        {job.currentlyWorking ? 'Present' : `${job.endMonth} ${job.endYear}`}
                      </div>
                    </div>
                    {job.description && (
                      <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.6', marginTop: '4px' }}>
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {experience?.education?.length > 0 && (
            <div>
              <SectionTitle title="Education" palette={palette} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {experience.education.map((edu, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#1E293B', wordBreak: 'break-word' }}>{edu.institution}</div>
                      <div style={{ color: palette.primary, fontSize: '12px' }}>{edu.degree}</div>
                      {edu.hideGpa ? (
                        <div style={{ color: '#94A3B8', fontSize: '11px', fontStyle: 'italic' }}>GPA: Not disclosed</div>
                      ) : edu.gpa ? (
                        <div style={{ color: '#94A3B8', fontSize: '11px' }}>GPA: {edu.gpa}</div>
                      ) : null}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '11px', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {edu.startYear} —{' '}
                      {edu.currentlyStudying ? 'Present' : edu.endYear}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {experience?.references?.length > 0 && (
            <div>
              <SectionTitle title="References" palette={palette} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                {experience.references.map((ref, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#1E293B' }}>{ref.fullName}</div>
                    {ref.jobTitle && (
                      <div style={{ color: palette.primary, fontSize: '12px' }}>{ref.jobTitle}</div>
                    )}
                    <div style={{ color: '#64748B', fontSize: '12px' }}>{ref.company}</div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                      {ref.email && (
                        <span style={{ color: '#94A3B8', fontSize: '11px' }}>✉ {ref.email}</span>
                      )}
                      {ref.phone && (
                        <span style={{ color: '#94A3B8', fontSize: '11px' }}>📞 {ref.phone}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', backgroundColor: '#E2E8F0', flexShrink: 0 }} />

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

          {/* Skills */}
          {about?.skills?.length > 0 && (
            <div>
              <SectionTitle title="Skills" palette={palette} />
              <div style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>
                {about.skills.join(' · ')}
              </div>
            </div>
          )}

          {/* Languages */}
          {about?.languages?.length > 0 && (
            <div>
              <SectionTitle title="Languages" palette={palette} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {about.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontSize: '13px' }}>{lang.language}</span>
                    <span style={{ color: palette.primary, fontSize: '12px' }}>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {about?.hobbies?.length > 0 && (
            <div>
              <SectionTitle title="Hobbies" palette={palette} />
              <div style={{ color: '#475569', fontSize: '12px', lineHeight: '1.6', marginTop: '8px' }}>
                {about.hobbies.join(' · ')}
              </div>
            </div>
          )}

          {/* Links */}
          {about?.links?.length > 0 && (
            <div>
              <SectionTitle title="Links" palette={palette} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {about.links.map((link, i) => (
                  <div key={i}>
                    <div style={{ color: palette.primary, fontSize: '11px', fontWeight: '600' }}>{link.label}</div>
                    <div style={{ color: '#64748B', fontSize: '11px', wordBreak: 'break-all' }}>{link.url}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Helper components ────────────────────────────────────────

function SectionTitle({ title, palette }) {
  return (
    <div style={{
      fontSize: '12px',
      fontWeight: '700',
      color: palette.dark,
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: `2px solid ${palette.primary}`,
      paddingBottom: '4px',
    }}>
      {title}
    </div>
  );
}

function HeaderContact({ icon, text, palette }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '11px', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: palette.primary, fontSize: '12px', wordBreak: 'break-all' }}>{text}</span>
    </div>
  );
}

export default ProfessionalTemplate;
