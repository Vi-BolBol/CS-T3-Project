function ModernTemplate({ cvData, palette }) {
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
        padding: '48px 56px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header — photo + name + contact inline */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '28px',
        paddingBottom: '24px',
        borderBottom: `3px solid ${palette.primary}`,
      }}>
        {photo && (
          <img
            src={photo}
            alt="Profile"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${palette.primary}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: palette.dark,
            marginBottom: '4px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}>
            {personal?.fullName || 'Your Name'}
          </div>
          {/* Contact row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '8px',
          }}>
            {personal?.email && (
              <ContactChip icon="✉" text={personal.email} />
            )}
            {personal?.phoneNumber && (
              <ContactChip icon="📞" text={personal.phoneNumber} />
            )}
            {personal?.location && (
              <ContactChip icon="📍" text={personal.location} />
            )}
            {about?.links?.map((link, i) => (
              <ContactChip key={i} icon="🔗" text={link.url} />
            ))}
          </div>
        </div>
      </div>

      {/* About Me */}
      {about?.aboutMe && (
        <Section title="About Me" palette={palette}>
          <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>
            {about.aboutMe}
          </p>
        </Section>
      )}

      {/* Skills + Languages side by side */}
      {(about?.skills?.length > 0 || about?.languages?.length > 0) && (
        <div style={{ display: 'flex', gap: '32px', marginBottom: '20px' }}>
          {about?.skills?.length > 0 && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <SectionTitle title="Skills" palette={palette} />
              <div style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>
                {about.skills.join(' · ')}
              </div>
            </div>
          )}
          {about?.languages?.length > 0 && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <SectionTitle title="Languages" palette={palette} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
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
        </div>
      )}

      {/* Work Experience */}
      {experience?.workExperience?.length > 0 && (
        <Section title="Work Experience" palette={palette}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.workExperience.map((job, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#1E293B', wordBreak: 'break-word' }}>
                      {job.jobTitle}
                    </div>
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
        </Section>
      )}

      {/* Education */}
      {experience?.education?.length > 0 && (
        <Section title="Education" palette={palette}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experience.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
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
            ))}
          </div>
        </Section>
      )}

      {/* Hobbies */}
      {about?.hobbies?.length > 0 && (
        <Section title="Hobbies" palette={palette}>
          <div style={{ color: '#475569', fontSize: '12px', lineHeight: '1.6' }}>
            {about.hobbies.join(' · ')}
          </div>
        </Section>
      )}

      {/* References */}
      {experience?.references?.length > 0 && (
        <Section title="References" palette={palette}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {experience.references.map((ref, i) => (
              <div key={i} style={{ flex: '1 1 200px' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#1E293B' }}>{ref.fullName}</div>
                {ref.jobTitle && (
                  <div style={{ color: palette.primary, fontSize: '12px' }}>{ref.jobTitle}</div>
                )}
                <div style={{ color: '#64748B', fontSize: '12px' }}>{ref.company}</div>
                {ref.email && (
                  <div style={{ color: '#94A3B8', fontSize: '11px' }}>✉ {ref.email}</div>
                )}
                {ref.phone && (
                  <div style={{ color: '#94A3B8', fontSize: '11px' }}>📞 {ref.phone}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

    </div>
  );
}

// ── Helper components ────────────────────────────────────────

function SectionTitle({ title, palette }) {
  return (
    <div style={{
      fontSize: '13px',
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

function Section({ title, palette, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <SectionTitle title={title} palette={palette} />
      <div style={{ marginTop: '10px' }}>{children}</div>
    </div>
  );
}

function ContactChip({ icon, text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: '#475569',
    }}>
      <span style={{ fontSize: '11px', flexShrink: 0 }}>{icon}</span>
      <span style={{ wordBreak: 'break-all' }}>{text}</span>
    </div>
  );
}

export default ModernTemplate;
