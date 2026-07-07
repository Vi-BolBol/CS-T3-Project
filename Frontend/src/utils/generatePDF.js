import jsPDF from 'jspdf'

const PAGE_WIDTH = 210 // A4 mm
const PAGE_HEIGHT = 297
const SIDEBAR_WIDTH = 65
const MARGIN = 10
const MAIN_X = SIDEBAR_WIDTH + 12
const MAIN_WIDTH = PAGE_WIDTH - MAIN_X - MARGIN

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

function addWrapped(pdf, text, x, y, maxWidth, lineHeight) {
  const lines = pdf.splitTextToSize(text, maxWidth)
  pdf.text(lines, x, y)
  return y + lines.length * lineHeight
}

function ensureMainSpace(pdf, y, needed) {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    pdf.addPage()
    return MARGIN
  }
  return y
}

function mainSectionHeader(pdf, title, palette, x, y, width) {
  const p = hexToRgb(palette.primary)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(30, 41, 59)
  pdf.text(title.toUpperCase(), x, y)
  pdf.setDrawColor(p.r, p.g, p.b)
  pdf.setLineWidth(0.6)
  pdf.line(x, y + 1.5, x + width, y + 1.5)
  return y + 8
}

function sidebarSectionHeader(pdf, title, palette, x, y, width) {
  const p = hexToRgb(palette.primary)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8.5)
  pdf.setTextColor(p.r, p.g, p.b)
  pdf.text(title.toUpperCase(), x, y)
  pdf.setDrawColor(p.r, p.g, p.b)
  pdf.setLineWidth(0.2)
  pdf.line(x, y + 1.5, x + width, y + 1.5)
  return y + 6
}

function circleCropImage(dataUrl, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Cover-fit the image into the circle
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ── Classic: dark sidebar (photo, contact, skills, languages, hobbies) + white main content ──
async function buildClassic(pdf, cvData, palette) {
  const { personal, about, experience, photo } = cvData
  const dark = hexToRgb(palette.dark)
  const primary = hexToRgb(palette.primary)

  // Sidebar background
  pdf.setFillColor(dark.r, dark.g, dark.b)
  pdf.rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT, 'F')

  let sy = 16
  const sx = 8
  const sw = SIDEBAR_WIDTH - 16

  // Photo (circle-cropped via clipping isn't native to jsPDF easily, so use a square with rounded corners look via addImage + border)
  if (photo) {
    try {
      const circlePhoto = await circleCropImage(photo);
      const photoSize = 32
      const photoX = SIDEBAR_WIDTH / 2 - photoSize / 2
      pdf.addImage(circlePhoto, 'PNG', photoX, sy, photoSize, photoSize, undefined, 'FAST')
      sy += photoSize + 8
    } catch (e) {
      console.warn('Could not embed photo:', e)
    }
  }

  // Name
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.setTextColor(255, 255, 255)
  sy = addWrapped(pdf, personal?.fullName || 'Your Name', sx, sy, sw, 6)
  sy += 4

  // Contact
  sy = sidebarSectionHeader(pdf, 'Contact', palette, sx, sy, sw)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)
  pdf.setTextColor(203, 213, 225)
  const contactLines = [personal?.phoneNumber, personal?.email, personal?.location].filter(Boolean)
  contactLines.forEach((line) => {
    sy = addWrapped(pdf, line, sx, sy, sw, 4.2)
  })
  sy += 4

  // Links
  if (about?.links?.length) {
    sy = sidebarSectionHeader(pdf, 'Links', palette, sx, sy, sw)
    pdf.setFontSize(8)
    about.links.forEach((l) => {
      sy = addWrapped(pdf, `${l.label}: ${l.url}`, sx, sy, sw, 4)
    })
    sy += 4
  }

  // Skills
  if (about?.skills?.length) {
    sy = sidebarSectionHeader(pdf, 'Skills', palette, sx, sy, sw)
    pdf.setFontSize(8.5)
    pdf.setTextColor(203, 213, 225)
    sy = addWrapped(pdf, about.skills.join('  ·  '), sx, sy, sw, 4.2)
    sy += 4
  }

  // Languages
  if (about?.languages?.length) {
    sy = sidebarSectionHeader(pdf, 'Languages', palette, sx, sy, sw)
    pdf.setFontSize(8.5)
    pdf.setTextColor(203, 213, 225)
    about.languages.forEach((lang) => {
      const label = typeof lang === 'string' ? lang : `${lang.language} — ${lang.proficiency}`
      sy = addWrapped(pdf, label, sx, sy, sw, 4.2)
    })
    sy += 4
  }

  // Hobbies
  if (about?.hobbies?.length) {
    sy = sidebarSectionHeader(pdf, 'Hobbies', palette, sx, sy, sw)
    pdf.setFontSize(8.5)
    pdf.setTextColor(148, 163, 184)
    sy = addWrapped(pdf, about.hobbies.join('  ·  '), sx, sy, sw, 4.2)
  }

  // ── Main content ──
  let y = 16

  if (about?.aboutMe) {
    y = mainSectionHeader(pdf, 'About Me', palette, MAIN_X, y, MAIN_WIDTH)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(71, 85, 105)
    y = addWrapped(pdf, about.aboutMe, MAIN_X, y, MAIN_WIDTH, 5)
    y += 6
  }

  if (experience?.workExperience?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'Work Experience', palette, MAIN_X, y, MAIN_WIDTH)
    experience.workExperience.forEach((job) => {
      y = ensureMainSpace(pdf, y, 20)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(30, 41, 59)
      pdf.text(job.jobTitle || '', MAIN_X, y)

      const dateLine = `${job.startMonth || ''} ${job.startYear || ''} — ${job.currentlyWorking ? 'Present' : `${job.endMonth || ''} ${job.endYear || ''}`}`
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.setTextColor(148, 163, 184)
      pdf.text(dateLine, MAIN_X + MAIN_WIDTH, y, { align: 'right' })
      y += 5

      pdf.setFontSize(10)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      const companyLine = [job.company, job.location].filter(Boolean).join(' — ')
      pdf.text(companyLine, MAIN_X, y)
      y += 5

      if (job.description) {
        pdf.setFontSize(9)
        pdf.setTextColor(100, 116, 139)
        y = addWrapped(pdf, job.description, MAIN_X, y, MAIN_WIDTH, 4.3)
      }
      y += 5
    })
  }

  if (experience?.education?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'Education', palette, MAIN_X, y, MAIN_WIDTH)
    experience.education.forEach((edu) => {
      y = ensureMainSpace(pdf, y, 16)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(30, 41, 59)
      pdf.text(edu.institution || '', MAIN_X, y)

      const dateLine = `${edu.startYear || ''} — ${edu.currentlyStudying ? 'Present' : edu.endYear || ''}`
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.setTextColor(148, 163, 184)
      pdf.text(dateLine, MAIN_X + MAIN_WIDTH, y, { align: 'right' })
      y += 5

      pdf.setFontSize(10)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      pdf.text(edu.degree || '', MAIN_X, y)
      y += 5

      if (!edu.hideGpa && edu.gpa) {
        pdf.setFontSize(8.5)
        pdf.setTextColor(148, 163, 184)
        pdf.text(`GPA: ${edu.gpa}`, MAIN_X, y)
        y += 5
      }
      y += 3
    })
  }

  if (experience?.references?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'References', palette, MAIN_X, y, MAIN_WIDTH)
    experience.references.forEach((ref) => {
      y = ensureMainSpace(pdf, y, 16)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10.5)
      pdf.setTextColor(30, 41, 59)
      pdf.text(ref.fullName || '', MAIN_X, y)
      y += 5

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      const roleLine = [ref.jobTitle, ref.company].filter(Boolean).join(' at ')
      if (roleLine) {
        pdf.text(roleLine, MAIN_X, y)
        y += 5
      }

      const contactLine = [ref.email, ref.phone].filter(Boolean).join('   |   ')
      if (contactLine) {
        pdf.setFontSize(8.5)
        pdf.setTextColor(148, 163, 184)
        pdf.text(contactLine, MAIN_X, y)
        y += 5
      }
      y += 2
    })
  }
}

// ── Modern: single column, header row (photo+name+contact), then stacked sections ──
async function buildModern(pdf, cvData, palette) {
  const { personal, about, experience, photo } = cvData
  const primary = hexToRgb(palette.primary)
  const X = MARGIN
  const WIDTH = PAGE_WIDTH - MARGIN * 2

  let y = MARGIN + 6
  let textX = X

  if (photo) {
    try {
      const circlePhoto = await circleCropImage(photo)
      const photoSize = 24
      pdf.addImage(circlePhoto, 'PNG', X, y - 4, photoSize, photoSize, undefined, 'FAST')
      textX = X + photoSize + 6
    } catch (e) {
      console.warn('Could not embed photo:', e)
    }
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(18)
  pdf.setTextColor(15, 23, 42)
  pdf.text(personal?.fullName || 'Your Name', textX, y)
  y += 7

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(71, 85, 105)
  const contactLine = [personal?.email, personal?.phoneNumber, personal?.location].filter(Boolean).join('   •   ')
  if (contactLine) {
    pdf.text(contactLine, textX, y)
    y += 6
  }

  y = Math.max(y, MARGIN + 6 + 24) + 4
  pdf.setDrawColor(primary.r, primary.g, primary.b)
  pdf.setLineWidth(0.8)
  pdf.line(X, y, X + WIDTH, y)
  y += 8

  if (about?.aboutMe) {
    y = mainSectionHeader(pdf, 'About Me', palette, X, y, WIDTH)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(71, 85, 105)
    y = addWrapped(pdf, about.aboutMe, X, y, WIDTH, 5)
    y += 6
  }

  if (about?.skills?.length || about?.languages?.length) {
    y = ensureMainSpace(pdf, y, 16)
    const colWidth = (WIDTH - 10) / 2
    let leftY = y
    let rightY = y
    if (about?.skills?.length) {
      leftY = mainSectionHeader(pdf, 'Skills', palette, X, leftY, colWidth)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9.5)
      pdf.setTextColor(71, 85, 105)
      leftY = addWrapped(pdf, about.skills.join('  ·  '), X, leftY, colWidth, 4.4)
    }
    if (about?.languages?.length) {
      const rightX = X + colWidth + 10
      rightY = mainSectionHeader(pdf, 'Languages', palette, rightX, rightY, colWidth)
      pdf.setFontSize(9.5)
      about.languages.forEach((lang) => {
        const label = typeof lang === 'string' ? lang : `${lang.language} — ${lang.proficiency}`
        pdf.setTextColor(71, 85, 105)
        rightY = addWrapped(pdf, label, rightX, rightY, colWidth, 4.4)
      })
    }
    y = Math.max(leftY, rightY) + 6
  }

  if (experience?.workExperience?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'Work Experience', palette, X, y, WIDTH)
    experience.workExperience.forEach((job) => {
      y = ensureMainSpace(pdf, y, 20)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(30, 41, 59)
      pdf.text(job.jobTitle || '', X, y)

      const dateLine = `${job.startMonth || ''} ${job.startYear || ''} — ${job.currentlyWorking ? 'Present' : `${job.endMonth || ''} ${job.endYear || ''}`}`
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.setTextColor(148, 163, 184)
      pdf.text(dateLine, X + WIDTH, y, { align: 'right' })
      y += 5

      pdf.setFontSize(10)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      const companyLine = [job.company, job.location].filter(Boolean).join(' — ')
      pdf.text(companyLine, X, y)
      y += 5

      if (job.description) {
        pdf.setFontSize(9)
        pdf.setTextColor(100, 116, 139)
        y = addWrapped(pdf, job.description, X, y, WIDTH, 4.3)
      }
      y += 5
    })
  }

  if (experience?.education?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'Education', palette, X, y, WIDTH)
    experience.education.forEach((edu) => {
      y = ensureMainSpace(pdf, y, 16)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(30, 41, 59)
      pdf.text(edu.institution || '', X, y)

      const dateLine = `${edu.startYear || ''} — ${edu.currentlyStudying ? 'Present' : edu.endYear || ''}`
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.setTextColor(148, 163, 184)
      pdf.text(dateLine, X + WIDTH, y, { align: 'right' })
      y += 5

      pdf.setFontSize(10)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      pdf.text(edu.degree || '', X, y)
      y += 5

      if (!edu.hideGpa && edu.gpa) {
        pdf.setFontSize(8.5)
        pdf.setTextColor(148, 163, 184)
        pdf.text(`GPA: ${edu.gpa}`, X, y)
        y += 5
      }
      y += 3
    })
  }

  if (about?.hobbies?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'Hobbies', palette, X, y, WIDTH)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    pdf.setTextColor(71, 85, 105)
    y = addWrapped(pdf, about.hobbies.join('  ·  '), X, y, WIDTH, 4.4)
    y += 6
  }

  if (experience?.references?.length) {
    y = ensureMainSpace(pdf, y, 14)
    y = mainSectionHeader(pdf, 'References', palette, X, y, WIDTH)
    experience.references.forEach((ref) => {
      y = ensureMainSpace(pdf, y, 16)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10.5)
      pdf.setTextColor(30, 41, 59)
      pdf.text(ref.fullName || '', X, y)
      y += 5

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      const roleLine = [ref.jobTitle, ref.company].filter(Boolean).join(' at ')
      if (roleLine) {
        pdf.text(roleLine, X, y)
        y += 5
      }

      const contactLine2 = [ref.email, ref.phone].filter(Boolean).join('   |   ')
      if (contactLine2) {
        pdf.setFontSize(8.5)
        pdf.setTextColor(148, 163, 184)
        pdf.text(contactLine2, X, y)
        y += 5
      }
      y += 2
    })
  }
}

// ── Professional: dark header band (photo+name+contact), two-column body ──
async function buildProfessional(pdf, cvData, palette) {
  const { personal, about, experience, photo } = cvData
  const dark = hexToRgb(palette.dark)
  const primary = hexToRgb(palette.primary)
  const HEADER_HEIGHT = 38

  pdf.setFillColor(dark.r, dark.g, dark.b)
  pdf.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F')

  let textX = MARGIN
  const headerCenterY = HEADER_HEIGHT / 2

  if (photo) {
    try {
      const circlePhoto = await circleCropImage(photo)
      const photoSize = 26
      pdf.addImage(circlePhoto, 'PNG', MARGIN, headerCenterY - photoSize / 2, photoSize, photoSize, undefined, 'FAST')
      textX = MARGIN + photoSize + 8
    } catch (e) {
      console.warn('Could not embed photo:', e)
    }
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(17)
  pdf.setTextColor(255, 255, 255)
  pdf.text(personal?.fullName || 'Your Name', textX, headerCenterY - 2)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(primary.r, primary.g, primary.b)
  const contactLine = [personal?.email, personal?.phoneNumber, personal?.location].filter(Boolean).join('   •   ')
  if (contactLine) {
    pdf.text(contactLine, textX, headerCenterY + 6)
  }

  const LEFT_X = MARGIN
  const LEFT_WIDTH = (PAGE_WIDTH - MARGIN * 2) * 0.58
  const RIGHT_X = LEFT_X + LEFT_WIDTH + 10
  const RIGHT_WIDTH = PAGE_WIDTH - RIGHT_X - MARGIN

  let leftY = HEADER_HEIGHT + 10
  let rightY = HEADER_HEIGHT + 10

  if (about?.aboutMe) {
    leftY = mainSectionHeader(pdf, 'About Me', palette, LEFT_X, leftY, LEFT_WIDTH)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    pdf.setTextColor(71, 85, 105)
    leftY = addWrapped(pdf, about.aboutMe, LEFT_X, leftY, LEFT_WIDTH, 4.6)
    leftY += 6
  }

  if (experience?.workExperience?.length) {
    leftY = mainSectionHeader(pdf, 'Work Experience', palette, LEFT_X, leftY, LEFT_WIDTH)
    experience.workExperience.forEach((job) => {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(30, 41, 59)
      leftY = addWrapped(pdf, job.jobTitle || '', LEFT_X, leftY, LEFT_WIDTH, 4.6)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      const companyLine = [job.company, job.location].filter(Boolean).join(' — ')
      pdf.text(companyLine, LEFT_X, leftY)
      leftY += 4.5

      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      const dateLine = `${job.startMonth || ''} ${job.startYear || ''} — ${job.currentlyWorking ? 'Present' : `${job.endMonth || ''} ${job.endYear || ''}`}`
      pdf.text(dateLine, LEFT_X, leftY)
      leftY += 4.5

      if (job.description) {
        pdf.setFontSize(8.5)
        pdf.setTextColor(100, 116, 139)
        leftY = addWrapped(pdf, job.description, LEFT_X, leftY, LEFT_WIDTH, 4)
      }
      leftY += 5
    })
  }

  if (experience?.education?.length) {
    leftY = mainSectionHeader(pdf, 'Education', palette, LEFT_X, leftY, LEFT_WIDTH)
    experience.education.forEach((edu) => {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(30, 41, 59)
      leftY = addWrapped(pdf, edu.institution || '', LEFT_X, leftY, LEFT_WIDTH, 4.6)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      pdf.text(edu.degree || '', LEFT_X, leftY)
      leftY += 4.5

      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      const dateLine = `${edu.startYear || ''} — ${edu.currentlyStudying ? 'Present' : edu.endYear || ''}`
      pdf.text(dateLine, LEFT_X, leftY)
      leftY += 4.5

      if (!edu.hideGpa && edu.gpa) {
        pdf.text(`GPA: ${edu.gpa}`, LEFT_X, leftY)
        leftY += 4.5
      }
      leftY += 3
    })
  }

  if (experience?.references?.length) {
    leftY = mainSectionHeader(pdf, 'References', palette, LEFT_X, leftY, LEFT_WIDTH)
    experience.references.forEach((ref) => {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9.5)
      pdf.setTextColor(30, 41, 59)
      pdf.text(ref.fullName || '', LEFT_X, leftY)
      leftY += 4.4

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.setTextColor(primary.r, primary.g, primary.b)
      const roleLine = [ref.jobTitle, ref.company].filter(Boolean).join(' at ')
      if (roleLine) {
        pdf.text(roleLine, LEFT_X, leftY)
        leftY += 4.4
      }

      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      const contactLine2 = [ref.email, ref.phone].filter(Boolean).join('   |   ')
      if (contactLine2) {
        pdf.text(contactLine2, LEFT_X, leftY)
        leftY += 4.4
      }
      leftY += 3
    })
  }

  if (about?.skills?.length) {
    rightY = mainSectionHeader(pdf, 'Skills', palette, RIGHT_X, rightY, RIGHT_WIDTH)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(71, 85, 105)
    rightY = addWrapped(pdf, about.skills.join('  ·  '), RIGHT_X, rightY, RIGHT_WIDTH, 4.3)
    rightY += 6
  }

  if (about?.languages?.length) {
    rightY = mainSectionHeader(pdf, 'Languages', palette, RIGHT_X, rightY, RIGHT_WIDTH)
    pdf.setFontSize(9)
    about.languages.forEach((lang) => {
      const label = typeof lang === 'string' ? lang : `${lang.language} — ${lang.proficiency}`
      pdf.setTextColor(71, 85, 105)
      rightY = addWrapped(pdf, label, RIGHT_X, rightY, RIGHT_WIDTH, 4.3)
    })
    rightY += 6
  }

  if (about?.hobbies?.length) {
    rightY = mainSectionHeader(pdf, 'Hobbies', palette, RIGHT_X, rightY, RIGHT_WIDTH)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(71, 85, 105)
    rightY = addWrapped(pdf, about.hobbies.join('  ·  '), RIGHT_X, rightY, RIGHT_WIDTH, 4.2)
    rightY += 6
  }

  if (about?.links?.length) {
    rightY = mainSectionHeader(pdf, 'Links', palette, RIGHT_X, rightY, RIGHT_WIDTH)
    pdf.setFontSize(8.5)
    about.links.forEach((l) => {
      pdf.setTextColor(primary.r, primary.g, primary.b)
      pdf.text(l.label || '', RIGHT_X, rightY)
      rightY += 4
      pdf.setTextColor(100, 116, 139)
      rightY = addWrapped(pdf, l.url || '', RIGHT_X, rightY, RIGHT_WIDTH, 4)
    })
  }
}

export async function generatePDF(cvData, template = 'classic', palette) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const activePalette = palette || { name: 'Emerald', primary: '#34D399', dark: '#0F172A' }

  switch (template) {
    case 'modern':
      await buildModern(pdf, cvData, activePalette)
      break
    case 'professional':
      await buildProfessional(pdf, cvData, activePalette)
      break
    case 'classic':
    default:
      await buildClassic(pdf, cvData, activePalette)
  }

  return { pdf }
}