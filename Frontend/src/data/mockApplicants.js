// TEMPORARY mock data layer for applicants and CV review.
// There is no /api/applications endpoint yet (the Application + Cv Prisma
// models exist, but no controller/service/routes were built for them).
// Field names here intentionally mirror what that future API will return
// (studentId, cvId, status: pending/reviewed/accepted/rejected, plus a
// cvData blob shaped like CVBuilderContext's initialCvData) so swapping
// this file out for a real fetch later is a small, mechanical change.

const CV_TEMPLATE_PALETTES = {
  emerald: { name: 'Emerald', primary: '#34D399', dark: '#0F172A' },
  ocean: { name: 'Ocean', primary: '#60A5FA', dark: '#0F1729' },
  purple: { name: 'Purple', primary: '#A78BFA', dark: '#150F29' },
};

function buildCvData({ fullName, location, email, phone, about, skills, education, experience }) {
  return {
    photo: null,
    personal: {
      fullName,
      birthDay: '14',
      birthMonth: '03',
      birthYear: '2003',
      location,
      gender: '',
      phoneNumber: phone,
      email,
    },
    about: {
      aboutMe: about,
      skills,
      hobbies: [],
      languages: ['English', 'Khmer'],
      links: [],
    },
    experience: {
      workExperience: experience,
      education,
      references: [],
    },
  };
}

const MOCK_APPLICANTS_BY_INTERNSHIP = {
  1: [
    {
      id: 101,
      studentId: 5001,
      internshipId: 1,
      cvId: 9001,
      status: 'pending',
      appliedAt: '2026-07-06T09:15:00Z',
      matchScore: 96,
      name: 'Clara Sterling',
      role: 'MSc HCI Candidate @ Stanford',
      university: 'Stanford University',
      avatar: 'CS',
      template: 'classic',
      palette: CV_TEMPLATE_PALETTES.emerald,
      cvData: buildCvData({
        fullName: 'Clara Sterling',
        location: 'San Francisco, CA',
        email: 'clara.sterling@stanford.edu',
        phone: '+1 415 555 0142',
        about: 'HCI researcher focused on generative UX studies and evaluative research methods for enterprise product teams.',
        skills: ['User Research', 'Figma', 'Usability Testing', 'Python'],
        education: [
          { institution: 'Stanford University', degree: 'MSc Human-Computer Interaction', startYear: '2024', endYear: '2026', currentlyStudying: true, hideGpa: true },
        ],
        experience: [
          { jobTitle: 'UX Research Intern', company: 'Google', location: 'Mountain View, CA', startMonth: 'Jun', startYear: '2025', endMonth: 'Aug', endYear: '2025', currentlyWorking: false, description: 'Ran generative studies for Workspace product surfaces.' },
        ],
      }),
    },
    {
      id: 102,
      studentId: 5002,
      internshipId: 1,
      cvId: 9002,
      status: 'pending',
      appliedAt: '2026-07-06T06:40:00Z',
      matchScore: 91,
      name: 'Marcus Thorne',
      role: 'Product Design Grad',
      university: 'UC Berkeley',
      avatar: 'MT',
      template: 'modern',
      palette: CV_TEMPLATE_PALETTES.ocean,
      cvData: buildCvData({
        fullName: 'Marcus Thorne',
        location: 'Berkeley, CA',
        email: 'marcus.thorne@berkeley.edu',
        phone: '+1 510 555 0198',
        about: 'Product design graduate with a focus on evaluative research and rapid prototyping for B2B tools.',
        skills: ['Prototyping', 'Design Systems', 'User Interviews'],
        education: [
          { institution: 'UC Berkeley', degree: 'BA Cognitive Science', startYear: '2021', endYear: '2025', currentlyStudying: false, hideGpa: true },
        ],
        experience: [
          { jobTitle: 'Design Intern', company: 'Figma', location: 'San Francisco, CA', startMonth: 'Sep', startYear: '2024', endMonth: 'Dec', endYear: '2024', currentlyWorking: false, description: 'Contributed to the community plugin design system.' },
        ],
      }),
    },
  ],
  2: [
    {
      id: 201,
      studentId: 5003,
      internshipId: 2,
      cvId: 9003,
      status: 'reviewed',
      appliedAt: '2026-07-05T14:05:00Z',
      matchScore: 94,
      name: 'Alex Mercer',
      role: 'Backend Enthusiast',
      university: 'MIT',
      avatar: 'AM',
      template: 'professional',
      palette: CV_TEMPLATE_PALETTES.purple,
      cvData: buildCvData({
        fullName: 'Alex Mercer',
        location: 'Cambridge, MA',
        email: 'alex.mercer@mit.edu',
        phone: '+1 617 555 0110',
        about: 'Backend-focused engineer who enjoys scaling web services and optimizing transactional database pipelines.',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'System Design'],
        education: [
          { institution: 'MIT', degree: 'BSc Computer Science', startYear: '2022', endYear: '2026', currentlyStudying: true, hideGpa: true },
        ],
        experience: [
          { jobTitle: 'Infrastructure Intern', company: 'Stripe', location: 'Remote', startMonth: 'Jun', startYear: '2025', endMonth: 'Aug', endYear: '2025', currentlyWorking: false, description: 'Optimized transaction pipeline throughput by 18%.' },
        ],
      }),
    },
  ],
  3: [],
};

export function getApplicantsForInternship(internshipId) {
  return MOCK_APPLICANTS_BY_INTERNSHIP[internshipId] || [];
}

export function getApplicantById(applicantId) {
  const all = Object.values(MOCK_APPLICANTS_BY_INTERNSHIP).flat();
  return all.find((a) => String(a.id) === String(applicantId)) || null;
}
