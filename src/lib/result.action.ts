"use server";

import { prisma } from "./connect";

type StudentResultType = {
  studentId: number;
  year: number;
  gpa: number | null;
  type: string;
  className: string;
  section: string;
  status: string;
  totalMarks: number;
  position?: number;
  subjects: {
    subjectName: string;
    marks: number;
    grade: string;
  }[];
};

type dataType = {
  studentId: number;
  subjectName: string;
  marks: number;
};
type othersType = {
  session: string;
  className: string;
  section: string;
  exam: string;
};

export const importResults = async (data: dataType[], others: othersType) => {
  const filteredData = data.filter((std) => std.studentId !== null);

  function convertToStudentArray(data: dataType[]) {
    const studentMap: Record<number, StudentResultType> = {};

    // Helper function to convert grade to numeric value
    function gradeToNumeric(grade: string): number {
      switch (grade) {
        case "A+":
          return 4.0;
        case "A":
          return 4.0;
        case "A-":
          return 3.7;
        case "B+":
          return 3.3;
        case "B":
          return 3.0;
        case "B-":
          return 2.7;
        case "C+":
          return 2.3;
        case "C":
          return 2.0;
        case "C-":
          return 1.7;
        case "D+":
          return 1.3;
        case "D":
          return 1.0;
        case "F":
          return 0.0;
        default:
          return 0.0; // Default to 0 for unknown grades
      }
    }

    // Helper function to convert marks to grade
    function marksToGrade(marks: number): string {
      if (marks >= 90) {
        return "A+";
      } else if (marks >= 85) {
        return "A";
      } else if (marks >= 80) {
        return "A-";
      } else if (marks >= 75) {
        return "B+";
      } else if (marks >= 70) {
        return "B";
      } else if (marks >= 65) {
        return "B-";
      } else if (marks >= 60) {
        return "C+";
      } else if (marks >= 55) {
        return "C";
      } else if (marks >= 50) {
        return "C-";
      } else if (marks >= 45) {
        return "D+";
      } else if (marks >= 40) {
        return "D";
      } else {
        return "F";
      }
    }

    // Helper function to calculate student status
    function calculateStatus(student: StudentResultType): string {
      const hasFailingGrade = student.subjects.some(
        (subject) => subject.grade === "F"
      );
      return hasFailingGrade ? "Fail" : "Pass";
    }

    for (const item of data) {
      const { studentId, subjectName, marks } = item;

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          studentId,
          year: parseInt(others.session),
          type: others.exam,
          className: others.className,
          section: others.section,
          gpa: 0,
          totalMarks: 0,
          status: "",
          subjects: [],
        };
      }

      const grade = marksToGrade(marks); // Calculate grade from marks
      studentMap[studentId].subjects.push({ subjectName, marks, grade });
    }

    // Calculate total marks and status for each student
    for (const studentId in studentMap) {
      const student = studentMap[studentId];

      const totalMarks = student.subjects.reduce((total, subject) => {
        return total + subject.marks;
      }, 0);
      student.totalMarks = totalMarks; // Set total marks

      const totalGradePoints = student.subjects.reduce((total, subject) => {
        return total + gradeToNumeric(subject.grade);
      }, 0);

      const totalSubjects = student.subjects.length; // need to add total subjects number

      const gpa = totalGradePoints / totalSubjects;

      student.gpa = parseFloat(gpa.toFixed(2));

      student.status = calculateStatus(student); // Calculate status based on GPA
    }

    // Sort students by total marks to determine position
    const sortedStudents = Object.values(studentMap).sort(
      (a, b) => b.totalMarks - a.totalMarks
    );

    // filter failed students
    const filteredPassedStudent = sortedStudents.filter(
      (std) => std.status !== "Fail"
    );

    // Calculate position based on sorted order
    let position = 1;
    filteredPassedStudent.forEach((student, index) => {
      if (
        index > 0 &&
        student.totalMarks !== filteredPassedStudent[index - 1].totalMarks
      ) {
        position = index + 1;
      }
      student.position = position;
    });

    return sortedStudents;
  }

  const res = convertToStudentArray(filteredData);

  try {
    await prisma.result.createMany({
      data: res,
      skipDuplicates: true,
    });

    return { success: "Import result successfull" };
  } catch (error) {
    console.log(error);
    return { error: "import result failed!" };
  }
};
