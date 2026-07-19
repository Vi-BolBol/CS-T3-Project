import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // npm install bcrypt 

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  
//   await prisma.auditLog.deleteMany();
//   await prisma.savedInternship.deleteMany();
//   await prisma.application.deleteMany();
//   await prisma.cv.deleteMany();
//   await prisma.internship.deleteMany();
//   await prisma.companyProfile.deleteMany();
//   await prisma.studentProfile.deleteMany();
//   await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);


  const studentUsersData = Array.from({ length: 6 }).map((_, i) => ({
    email: `student${i + 1}@example.com`,
    passwordHash: hashedPassword,
    role: "student",
    status: "active",
  }));

  const companyUsersData = Array.from({ length: 3 }).map((_, i) => ({
    email: `company${i + 1}@example.com`,
    passwordHash: hashedPassword,
    role: "company",
    status: "active",
  }));

  const adminUserData = {
    email: "admin1@example.com",
    passwordHash: hashedPassword,
    role: "admin",
    status: "active",
  };

  const allUsersData = [...studentUsersData, ...companyUsersData, adminUserData];

  const users = [];
  for (const data of allUsersData) {
    const user = await prisma.user.create({ data });
    users.push(user);
  }

  const studentUsers = users.filter((u) => u.role === "student");
  const companyUsers = users.filter((u) => u.role === "company");

  console.log(`Created ${users.length} users`);

 
  const extraStudents = [];
  for (let i = 7; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `student${i}@example.com`,
        passwordHash: hashedPassword,
        role: "student",
        status: "active",
      },
    });
    extraStudents.push(user);
  }
  const allStudentUsers = [...studentUsers, ...extraStudents];

  const studentNames = [
    "Sokha Chan", "Dara Kim", "Sreymom Lay", "Vuthy Ros", "Chenda Pich",
    "Bopha Sok", "Rithy Heng", "Sopheak Nou", "Mealea Yin", "Kosal Tep",
  ];

  const studentProfiles = [];
  for (let i = 0; i < allStudentUsers.length; i++) {
    const profile = await prisma.studentProfile.create({
      data: {
        userId: allStudentUsers[i].id,
        fullName: studentNames[i],
        phone: `+855 1${i}${i} 234 567`,
        bio: `Motivated student passionate about learning and growing in tech.`,
        education: "Bachelor's Degree in Computer Science, CADT",
        skills: "JavaScript, React, Node.js, SQL",
        profileImage: null,
      },
    });
    studentProfiles.push(profile);
  }
  console.log(`Created ${studentProfiles.length} student profiles`);


  const companyNames = [
    "TechNova", "CloudBridge", "Innoware", "DataForge", "PixelCraft",
    "ByteWorks", "CodeSphere", "NextGen Solutions", "Skyline Digital", "Vertex Labs",
  ];

  const extraCompanyUsers = [];
  for (let i = companyUsers.length + 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `company${i}@example.com`,
        passwordHash: hashedPassword,
        role: "company",
        status: "active",
      },
    });
    extraCompanyUsers.push(user);
  }
  const allCompanyUsers = [...companyUsers, ...extraCompanyUsers];

  const companyProfiles = [];
  for (let i = 0; i < allCompanyUsers.length; i++) {
    const profile = await prisma.companyProfile.create({
      data: {
        userId: allCompanyUsers[i].id,
        companyName: companyNames[i],
        industry: "Information Technology",
        description: `${companyNames[i]} builds innovative software solutions.`,
        website: `https://${companyNames[i].toLowerCase().replace(/\s+/g, "")}.com`,
        contact: `+855 23 ${100 + i} ${200 + i}`,
        telegramLink: `https://t.me/${companyNames[i].toLowerCase().replace(/\s+/g, "")}`,
        logoUrl: null,
      },
    });
    companyProfiles.push(profile);
  }
  console.log(`Created ${companyProfiles.length} company profiles`);


  const cvs = [];
  for (let i = 0; i < 10; i++) {
    const cv = await prisma.cv.create({
      data: {
        studentId: allStudentUsers[i % allStudentUsers.length].id,
        fileUrl: `https://storage.example.com/cvs/cv_${i + 1}.pdf`,
        score: (70 + i * 2).toFixed(2),
        userCvData: { experienceYears: i % 3, tags: ["frontend", "backend"] },
      },
    });
    cvs.push(cv);
  }
  console.log(`Created ${cvs.length} CVs`);


  const workEnvs = ["remote", "onsite", "hybrid"];
  const titles = [
    "Frontend Developer Intern", "Backend Developer Intern", "UI/UX Design Intern",
    "Data Analyst Intern", "Mobile App Developer Intern", "QA Tester Intern",
    "DevOps Intern", "Marketing Intern", "Product Management Intern", "Full Stack Developer Intern",
  ];

  const internships = [];
  for (let i = 0; i < 10; i++) {
    const internship = await prisma.internship.create({
      data: {
        companyId: companyProfiles[i % companyProfiles.length].id,
        title: titles[i],
        internshipCategory: "Software Development",
        workEnvironment: workEnvs[i % workEnvs.length],
        location: "Phnom Penh, Cambodia",
        jobDescription: `Join our team as a ${titles[i]} and work on real-world projects.`,
        requirements: "Currently enrolled in a related field, eager to learn.",
        salary: 150 + i * 10,
        deadline: new Date(2026, 8, 30),
        status: "open",
        skills: "Communication, Problem Solving, Teamwork",
        education: "Undergraduate",
        benefit: "Certificate, Mentorship, Possible full-time offer",
        companyCulture: "Fast-paced, collaborative, growth-oriented",
        companyEmailLink: `hr@company${i + 1}.com`,
        telegramLink: `https://t.me/company${i + 1}hr`,
      },
    });
    internships.push(internship);
  }
  console.log(`Created ${internships.length} internships`);

  const appStatuses = ["pending", "reviewed", "accepted", "rejected"];
  const applications = [];
  for (let i = 0; i < 10; i++) {
    const application = await prisma.application.create({
      data: {
        studentId: allStudentUsers[i % allStudentUsers.length].id,
        internshipId: internships[i % internships.length].id,
        cvId: cvs[i % cvs.length].id,
        status: appStatuses[i % appStatuses.length],
        // A decided application needs a decision timestamp; seenAt stays null so
        // the seeded student actually sees the notification badge on first login.
        decidedAt: ["accepted", "rejected"].includes(appStatuses[i % appStatuses.length])
          ? new Date()
          : null,
      },
    });
    applications.push(application);
  }
  console.log(`Created ${applications.length} applications`);

  let savedCount = 0;
  for (let i = 0; i < 10; i++) {
    const userId = allStudentUsers[i % allStudentUsers.length].id;
    const internshipId = internships[(i + 3) % internships.length].id; 
    try {
      await prisma.savedInternship.create({
        data: { userId, internshipId },
      });
      savedCount++;
    } catch (e) {
      
    }
  }
  console.log(`Created ${savedCount} saved internships`);


  const actions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "APPLY"];
  const entityTypes = ["User", "Internship", "Application", "Cv", "CompanyProfile"];

  const auditLogs = [];
  for (let i = 0; i < 10; i++) {
    const log = await prisma.auditLog.create({
      data: {
        userId: users[i % users.length].id,
        action: actions[i % actions.length],
        entityType: entityTypes[i % entityTypes.length],
        entityId: i + 1,
      },
    });
    auditLogs.push(log);
  }
  console.log(`Created ${auditLogs.length} audit logs`);

  console.log("All tables seeded with 10 records each (or close to it where uniqueness constraints apply).");
}

main()
  .then(async () => {
    console.log("Database seeded successfully!");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });