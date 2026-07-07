function ClassicTemplate({ cvData, palette }) {
  const { personal, about, experience } = cvData;
  const photo = cvData.photo;

  return (
    <div
      id="cv-preview"
      style={{
        width: '794px',
        minHeight: '1123px',
        display: 'flex',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Left sidebar */}
      <div
        style={{
          width: '260px',
          backgroundColor: palette.dark,
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Photo */}
        {photo && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={photo}
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${palette.primary}`,
                flexShrink: 0,
              }}
            />
          </div>
        )}

        {/* Name */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            lineHeight: '1.3',
            marginBottom: '4px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}>
            {personal?.fullName || 'Your Name'}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarSection title="Contact" palette={palette} />
          {personal?.phoneNumber && (
            <SidebarItem icon="📞" text={personal.phoneNumber} />
          )}
          {personal?.email && (
            <SidebarItem icon="✉" text={personal.email} />
          )}
          {personal?.location && (
            <SidebarItem icon="📍" text={personal.location} />
          )}
        </div>

        {/* Links */}
        {about?.links?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SidebarSection title="Links" palette={palette} />
            {about.links.map((link, i) => (
              <SidebarItem key={i} icon="🔗" text={`${link.label}: ${link.url}`} />
            ))}
          </div>
        )}

        {/* Skills */}
        {about?.skills?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SidebarSection title="Skills" palette={palette} />
            <div style={{ color: '#CBD5E1', fontSize: '12px', lineHeight: '1.6' }}>
              {about.skills.join(' · ')}
            </div>
          </div>
        )}

        {/* Languages */}
        {about?.languages?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SidebarSection title="Languages" palette={palette} />
            {about.languages.map((lang, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#CBD5E1', fontSize: '12px' }}>{lang.language}</span>
                <span style={{ color: palette.primary, fontSize: '11px' }}>
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Hobbies */}
        {about?.hobbies?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SidebarSection title="Hobbies" palette={palette} />
            <div style={{ color: '#94A3B8', fontSize: '12px', lineHeight: '1.6' }}>
              {about.hobbies.join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

        {/* About Me */}
        {about?.aboutMe && (
          <div>
            <MainSection title="About Me" palette={palette} />
            <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7', marginTop: '8px' }}>
              {about.aboutMe}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience?.workExperience?.length > 0 && (
          <div>
            <MainSection title="Work Experience" palette={palette} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {experience.workExperience.map((job, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#1E293B', wordBreak: 'break-word' }}>{job.jobTitle}</div>
                      <div style={{ color: palette.primary, fontSize: '13px' }}>{job.company}</div>
                      {job.location && (
                        <div style={{ color: '#94A3B8', fontSize: '12px' }}>{job.location}</div>
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
            <MainSection title="Education" palette={palette} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {experience.education.map((edu, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#1E293B', wordBreak: 'break-word' }}>{edu.institution}</div>
                      <div style={{ color: palette.primary, fontSize: '13px' }}>{edu.degree}</div>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {experience?.references?.length > 0 && (
          <div>
            <MainSection title="References" palette={palette} />
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
    </div>
  );
}

// ── Small helper components ──────────────────────────────────

function SidebarSection({ title, palette }) {
  return (
    <div style={{
      color: palette.primary,
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      borderBottom: `1px solid ${palette.primary}44`,
      paddingBottom: '4px',
      marginBottom: '4px',
    }}>
      {title}
    </div>
  );
}

function SidebarItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
      <span style={{ fontSize: '11px', marginTop: '1px', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: '#CBD5E1', fontSize: '12px', lineHeight: '1.5', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {text}
      </span>
    </div>
  );
}

function MainSection({ title, palette }) {
  return (
    <div style={{
      fontSize: '14px',
      fontWeight: '700',
      color: '#1E293B',
      borderBottom: `2px solid ${palette.primary}`,
      paddingBottom: '4px',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {title}
    </div>
  );
}

export default ClassicTemplate;
