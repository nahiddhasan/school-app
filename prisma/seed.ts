import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
// import { PrismaClient } from "../src/app/gene/rated/prisma";

const prisma = new PrismaClient();
//generated client not work in seed file used @prisma/client from previous method
async function main() {
  // 1. Create Admin User
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

  // 2. Create Current Academic Year
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

  // 3. Create Classes with Sections
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

  // 4. Create Dummy Students and Enroll them
  const targetClass = await prisma.class.findFirst({
    where: { className: "Class 1" },
  });

  if (!targetClass) throw new Error("Class 1 not found");

  const studentsToCreate = 50; // number of dummy students
  let rollNumber = 1;

  for (let i = 0; i < studentsToCreate; i++) {
    const fullName = faker.person.fullName();
    const gender = faker.person.sex(); // "male" | "female"
    const dob = faker.date.birthdate({ min: 5, max: 7, mode: "age" }); // 5–7 yrs old
    const mobile = faker.phone.number({ style: "international" });
    const fatherName = faker.person.fullName({ sex: "male" });
    const motherName = faker.person.fullName({ sex: "female" });
    const guardianName = fatherName;
    const guardianPhone = mobile;

    // 1. Create Student only (without classRoll)
    const createdStudent = await prisma.student.create({
      data: {
        fullName,
        gender,
        dob,
        doa: new Date(),
        mobile,
        fatherName,
        motherName,
        fatherPhone: guardianPhone,
        gurdianName: guardianName,
        relation: "Father",
        gurdianPhone: guardianPhone,
      },
    });

    // 2. Create Enrollment (attach to class, academic year, section, and assign roll)
    await prisma.enrollment.create({
      data: {
        studentId: createdStudent.studentId,
        classId: targetClass.id,
        academicYearId: academicYear.id,
        section: sections[Math.floor(Math.random() * sections.length)],
        classRoll: rollNumber,
        status: "ADMITTED",
      },
    });

    rollNumber++;
  }

  console.log(`✅ ${studentsToCreate} dummy students created and enrolled!`);
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
