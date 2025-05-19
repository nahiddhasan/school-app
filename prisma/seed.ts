import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin", 10);

  await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      email: "admin@school.com",
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created!");

  const currentYear = new Date().getFullYear();

  const academicYear = await prisma.academicYear.upsert({
    where: { year: currentYear },
    update: {},
    create: {
      year: currentYear,
      current: true,
    },
  });

  console.log(`✅ Academic Year ${currentYear} created!`);

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
    await prisma.class.upsert({
      where: { className },
      update: {},
      create: {
        className,
        sectionName: sections,
      },
    });
  }

  console.log("✅ Classes with sections created!");

  const targetClass = await prisma.class.findFirst({
    where: { className: "Class 1" },
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
      },
    });

    await prisma.enrollment.create({
      data: {
        studentId: student.studentId,
        classId: targetClass.id,
        academicYearId: academicYear.id,
        section: sections[Math.floor(Math.random() * sections.length)],
        classRoll: rollNumber,
        status: "ADMITTED",
      },
    });

    rollNumber++;
  }

  console.log(`✅ ${studentsToCreate} students enrolled!`);

  // Create Subjects
  const subjectNames = ["Math", "English", "Science", "History"];
  const subjectRecords = await Promise.all(
    subjectNames.map((name) =>
      prisma.subject.create({
        data: { name },
      })
    )
  );

  console.log("✅ Subjects created!");

  // Create Teachers and Users
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
      },
    });

    await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: "TEACHER",
        teacherId: teacher.teacherId,
      },
    });
  }

  console.log("✅ Teachers and users created!");

  // Create Weekly Schedule for Class 1 Section A
  const teacherList = await prisma.teacher.findMany();
  for (let i = 0; i < 5; i++) {
    const teacher = teacherList[i % teacherList.length];
    const subject = await prisma.subject.findFirst({
      where: { id: teacher.subjectId! },
    });

    await prisma.weeklySchedule.create({
      data: {
        classId: targetClass.id,
        section: "A",
        teacherId: teacher.teacherId,
        subjectId: subject!.id,
        dayOfWeek: i,
        startTime: "08:00",
        endTime: "08:45",
      },
    });
  }

  console.log("✅ Weekly schedule created for Class 1 Section A!");

  // Create Event
  await prisma.event.create({
    data: {
      title: "Class 1 Science Fair",
      desc: "Some Description",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // +2 hrs
      classId: targetClass.id,
    },
  });

  // Create Announcement
  await prisma.announcement.create({
    data: {
      title: "Class 1 Unit Test Schedule Released",
      desc: "Some Description",
      classId: targetClass.id,
    },
  });

  console.log("✅ Event and announcement created!");
}

main()
  .then(() => {
    console.log("🌟 Database seeded successfully!");
  })
  .catch((e) => {
    console.error("❌ Seeding error: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
