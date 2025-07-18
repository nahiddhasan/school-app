import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedSchool({
  superAdminEmail,
  superAdminName,
  adminEmail,
  schoolData,
}: {
  superAdminEmail: string;
  superAdminName: string;
  adminEmail: string;
  schoolData: {
    name: string;
    address: string;
    phone: string;
    email: string;
    principalName: string;
    domainPrefix: string;
    motto: string;
    mission: string;
    vision: string;
    description: string;
  };
}) {
  const superAdminPassword = await bcrypt.hash("superadmin", 10);
  const adminPassword = await bcrypt.hash("admin", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      password: superAdminPassword,
      name: superAdminName,
      role: "SUPERADMIN",
    },
  });

  console.log(`✅ Super Admin created: ${superAdminEmail}`);

  const schoolInfo = await prisma.schoolInfo.create({
    data: {
      ...schoolData,
      superAdminId: superAdmin.id,
    },
  });

  console.log(`✅ School created: ${schoolData.name}`);

  // ✅ Update SUPERADMIN to include schoolId
  await prisma.user.update({
    where: { id: superAdmin.id },
    data: { schoolId: schoolInfo.id },
  });

  console.log("✅ Linked superAdmin to School with schoolId!");
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
      schoolId: schoolInfo.id,
    },
  });

  console.log(`✅ Admin created for ${schoolData.name}`);

  const currentYear = new Date().getFullYear();

  const academicYear = await prisma.academicYear.upsert({
    where: {
      year_schoolId: {
        year: currentYear,
        schoolId: schoolInfo.id,
      },
    },
    update: {},
    create: {
      year: currentYear,
      current: true,
      schoolId: schoolInfo.id,
    },
  });

  const classNames = [
    "Nursery",
    "KG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];
  const sections = ["A", "B", "C"];

  for (const className of classNames) {
    await prisma.class.create({
      data: {
        className,
        sectionName: sections,
        schoolId: schoolInfo.id,
      },
    });
  }

  console.log(`✅ Classes created for ${schoolData.name}`);

  const targetClass = await prisma.class.findFirst({
    where: { className: "Class 1", schoolId: schoolInfo.id },
  });
  if (!targetClass) throw new Error("Class 1 not found");

  const studentsToCreate = 50;
  let rollNumber = 1;

  for (let i = 0; i < studentsToCreate; i++) {
    const fullName = faker.person.fullName();
    const gender = faker.person.sex();
    const dob = faker.date.birthdate({ min: 5, max: 7, mode: "age" });
    const mobile = faker.phone.number({ style: "international" });
    const fatherName = faker.person.fullName({ sex: "male" });
    const motherName = faker.person.fullName({ sex: "female" });

    const student = await prisma.student.create({
      data: {
        fullName,
        gender,
        dob,
        doa: new Date(),
        mobile,
        fatherName,
        motherName,
        fatherPhone: mobile,
        gurdianName: fatherName,
        relation: "Father",
        gurdianPhone: mobile,
        schoolId: schoolInfo.id,
      },
    });

    await prisma.enrollment.create({
      data: {
        studentId: student.studentId,
        classId: targetClass.id!,
        academicYearId: academicYear.id,
        section: sections[Math.floor(Math.random() * sections.length)],
        classRoll: rollNumber++,
        status: "ADMITTED",
        schoolId: schoolInfo.id,
      },
    });
  }

  console.log(
    `✅ ${studentsToCreate} students enrolled for ${schoolData.name}`
  );

  const subjectNames = ["Math", "English", "Science", "History"];
  const subjectRecords = await Promise.all(
    subjectNames.map((name) =>
      prisma.subject.create({
        data: { name, schoolId: schoolInfo.id },
      })
    )
  );

  for (let i = 0; i < 4; i++) {
    const subject = subjectRecords[i];
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name });
    const password = await bcrypt.hash("teacher", 10);

    const teacher = await prisma.teacher.create({
      data: {
        name,
        phone: faker.phone.number(),
        email,
        dob: faker.date.birthdate({ min: 30, max: 40, mode: "age" }),
        gender: "Male",
        subjectId: subject.id,
        designation: "Subject Teacher",
        department: "Academic",
        address: faker.location.streetAddress(),
        profileImg: "",
        bloodGroup: "O+",
        schoolId: schoolInfo.id,
      },
    });

    await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: "TEACHER",
        teacherId: teacher.teacherId,
        schoolId: schoolInfo.id,
      },
    });
  }

  const teacherList = await prisma.teacher.findMany({
    where: { schoolId: schoolInfo.id },
  });

  for (let i = 0; i < 5; i++) {
    const teacher = teacherList[i % teacherList.length];
    const subject = await prisma.subject.findFirst({
      where: { id: teacher.subjectId! },
    });

    await prisma.weeklySchedule.create({
      data: {
        classId: targetClass.id!,
        section: "A",
        teacherId: teacher.teacherId,
        subjectId: subject!.id,
        dayOfWeek: i,
        startTime: "08:00",
        endTime: "08:45",
        schoolId: schoolInfo.id,
      },
    });
  }

  await prisma.event.create({
    data: {
      title: "Class 1 Science Fair",
      desc: "Some Description",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      classId: targetClass.id!,
      schoolId: schoolInfo.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Class 1 Unit Test Schedule Released",
      desc: "Some Description",
      classId: targetClass.id!,
      schoolId: schoolInfo.id,
    },
  });

  console.log(
    `✅ Events, announcements, and schedules created for ${schoolData.name}`
  );

  // ✅ Seed Slider Images
  await Promise.all(
    Array.from({ length: 4 }).map((_, i) =>
      prisma.sliderImage.create({
        data: {
          title: `Campus View ${i + 1}`,
          imageUrl: `/img/slide${i + 1}`,
          schoolId: schoolInfo.id,
        },
      })
    )
  );

  // ✅ Seed Gallery Images
  await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.galleryImage.create({
        data: {
          title: `Campus View ${i + 1}`,
          imageUrl: `/img/slide${i + 1}`,
          description: faker.lorem.sentence(),
          schoolId: schoolInfo.id,
        },
      })
    )
  );

  // ✅ Seed Highlights
  await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.highlight.create({
        data: {
          title: `Highlight ${i + 1}`,
          description: faker.lorem.sentences(2),
          iconUrl: faker.image.avatarGitHub(),
          schoolId: schoolInfo.id,
        },
      })
    )
  );

  // ✅ Seed Facilities
  await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.facility.create({
        data: {
          title: `Facility ${i + 1}`,
          description: faker.lorem.sentences(2),
          imageUrl: `/img/slide${i + 1}`,
          schoolId: schoolInfo.id,
        },
      })
    )
  );

  // ✅ Seed Testimonials
  await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.testimonial.create({
        data: {
          author: faker.person.fullName(),
          role: faker.person.jobTitle(),
          message: faker.lorem.paragraph(),
          imageUrl: faker.image.avatar(),
          schoolId: schoolInfo.id,
        },
      })
    )
  );

  console.log(
    `✅ Extras (Gallery, Highlights, Facilities, Testimonials) created for ${schoolData.name}`
  );
  // ✅ Create Top-Level Pages (Home is real, others are menu groups)
  const topLevelPages = [
    { title: "Home", isGroup: false, slug: "/" },
    { title: "About Us", isGroup: true },
    { title: "Academic", isGroup: true },
    { title: "Information", isGroup: true },
    { title: "Admission", isGroup: true },
    { title: "Campus Life", isGroup: true },
    { title: "Employment", isGroup: true },
    { title: "Contact", isGroup: false, slug: "/contact" },
  ];

  const pageMap: Record<string, string> = {};

  // Define static slugs for top-level groups
  const aboutSlug = "/about-us";
  const academicSlug = "/academic";
  const infoSlug = "/information";
  const admissionSlug = "/admission";

  for (const { title, isGroup, slug } of topLevelPages) {
    const generatedSlug = isGroup
      ? null
      : slug || `/${title.toLowerCase().replace(/\s+/g, "-")}`;

    const page = await prisma.page.create({
      data: {
        title,
        slug: generatedSlug,
        content: isGroup ? null : `${title} page content`,
        schoolId: schoolInfo.id,
      },
    });

    pageMap[title] = page.id;
  }

  // ✅ Subpages under "About Us"
  const aboutSubpages = [
    "Message from Chairman",
    "Message from Principal",
    "Governing Body",
    "Master Plan",
    "History",
    "Vision and Objectives",
    "Infrastructure",
  ];

  for (const title of aboutSubpages) {
    const slug = `${aboutSlug}/${title.toLowerCase().replace(/\s+/g, "-")}`;

    await prisma.page.create({
      data: {
        title,
        slug,
        content: `${title} content.`,
        parentId: pageMap["About Us"],
        schoolId: schoolInfo.id,
      },
    });
  }

  // ✅ Subpages under "Academic"
  const academicSubpages = [
    "Code of Conducts",
    "Guideline for Parents",
    "Dress Code",
  ];

  for (const title of academicSubpages) {
    const slug = `${academicSlug}/${title.toLowerCase().replace(/\s+/g, "-")}`;

    await prisma.page.create({
      data: {
        title,
        slug,
        content: `${title} content.`,
        parentId: pageMap["Academic"],
        schoolId: schoolInfo.id,
      },
    });
  }

  // ✅ Homework group inside Academic
  const homeworkGroup = await prisma.page.create({
    data: {
      title: "HomeWork And Class Lecture Documents",
      slug: null,
      content: null,
      parentId: pageMap["Academic"],
      schoolId: schoolInfo.id,
    },
  });

  const homeworkSubpages = [
    "Lesson Plan",
    "Academic calendar",
    "Syllabus",
    "Class Routine",
  ];

  for (const title of homeworkSubpages) {
    const slug = `${academicSlug}/homework-and-class-lecture-documents/${title
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    await prisma.page.create({
      data: {
        title,
        slug,
        content: `${title} content.`,
        parentId: homeworkGroup.id,
        schoolId: schoolInfo.id,
      },
    });
  }

  const infoSubpages = [
    "Notice Board",
    "Payment Procedure",
    "Facilities",
    "News and Events",
    "Our Achievements",
    "List of Holidays",
    "Teachers Info",
    "Student Info",
    "Policies & Guidelines",
    "Library",
    "Health and Environmental Awarness Info",
  ];

  for (const title of infoSubpages) {
    const slug = `${infoSlug}/${title.toLowerCase().replace(/\s+/g, "-")}`;

    await prisma.page.create({
      data: {
        title,
        slug,
        content: `${title} content.`,
        parentId: pageMap["Information"],
        schoolId: schoolInfo.id,
      },
    });
  }

  // ✅ Subpages under Admission
  const admissionSubpages = [
    "Apply Now",
    "Fast Facts‌",
    "Fees & Payment",
    "Scholarships",
    "Transfer Procedures",
  ];

  for (const title of admissionSubpages) {
    const slug = `${admissionSlug}/${title.toLowerCase().replace(/\s+/g, "-")}`;

    await prisma.page.create({
      data: {
        title,
        slug,
        content: `${title} content.`,
        parentId: pageMap["Admission"],
        schoolId: schoolInfo.id,
      },
    });
  }

  console.log(`✅ Pages with nested slugs seeded for ${schoolData.name}`);
}

async function main() {
  await seedSchool({
    superAdminEmail: "superadmin1@system.com",
    superAdminName: "Super Admin One",
    adminEmail: "admin1@school.com",
    schoolData: {
      name: "Greenwood International School",
      address: "123 School Rd, Springfield",
      phone: "+1-555-1234",
      email: "info@greenwoodschool.com",
      principalName: "John Doe",
      domainPrefix: "school1",
      mission: "To empower students with quality education and moral values.",
      motto: "Knowledge is Power",
      vision: "To be a beacon of excellence in education.",
      description:
        "Our school is a traditional educational institution focused on quality learning, moral values, and social development. With modern teaching methods, skilled teachers, and co-curricular activities, we ensure the all-round growth of our students. The environment is friendly and safe, where everyone is respected and given equal opportunities. Our aim is to help students gain knowledge, skills, and leadership qualities. Among all living beings, humans are the most complete, yet they are born the most incomplete. Unlike animals that come equipped for life, humans must learn and adapt. Nature has given humans less, but this is a strategy—allowing for growth, cooperation, and progress. Through unity and learning, people achieve what strength alone cannot. Our journey is one of collective advancement, where each individual contributes to the greater good.",
    },
  });

  await seedSchool({
    superAdminEmail: "superadmin2@system.com",
    superAdminName: "Super Admin Two",
    adminEmail: "admin2@school.com",
    schoolData: {
      name: "Riverside High School",
      address: "456 Lakeview Ave, Rivertown",
      phone: "+1-555-5678",
      email: "info@riversidehigh.com",
      principalName: "Jane Smith",
      domainPrefix: "school2",
      mission: "To empower students with quality education and moral values.",
      motto: "Knowledge is Power",
      vision: "To be a beacon of excellence in education.",
      description:
        "Our school is a traditional educational institution focused on quality learning, moral values, and social development. With modern teaching methods, skilled teachers, and co-curricular activities, we ensure the all-round growth of our students. The environment is friendly and safe, where everyone is respected and given equal opportunities. Our aim is to help students gain knowledge, skills, and leadership qualities. Among all living beings, humans are the most complete, yet they are born the most incomplete. Unlike animals that come equipped for life, humans must learn and adapt. Nature has given humans less, but this is a strategy—allowing for growth, cooperation, and progress. Through unity and learning, people achieve what strength alone cannot. Our journey is one of collective advancement, where each individual contributes to the greater good.",
    },
  });

  console.log("🌟 Database seeded successfully with two schools!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
