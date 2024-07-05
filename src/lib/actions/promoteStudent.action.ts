"use server";
import { prisma } from "../connect";
export const promoteStudent = async () => {
  // Manually assign class name and session (you can fetch this information from the user input or elsewhere)
  const className = "Seven"; // Manually assign class name
  const sessionName = 2025; // Manually assign session name

  // Get students ordered by result position
  const students = await prisma.student.findMany({
    include: {
      result: {
        select: {
          type: true,
          status: true,
        },
      },
    },
  });
  console.log(students);
  const results = await prisma.result.findMany();

  function findStudentPosition(studentId: number) {
    // Iterate through the array of students
    for (const student of results) {
      // Check if the current student's studentId matches the targetStudentId
      if (student.studentId === studentId) {
        // If found, return the position of the student
        return student.position;
      }
    }
    // If no student with the specified studentId is found, return null or handle appropriately
    return null;
  }

  // Iterate through each student
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const position = findStudentPosition(student.studentId);
    console.log(position);
    return;
    await prisma.student.create({
      data: {
        ...student,
        classRoll: String(position), // Assign new class roll based on position
        className: className,
        sessionName: sessionName,
      },
    });
  }
};
