import { Student } from "@prisma/client";

export type MenuItem = {
  title: string;
  path?: string;
  submenu?: MenuItem[];
};

export type SidebarItem = {
  title: string;
  path?: string;
  icon?: typeof LucideIcon;
  role?: string;
  submenu?: MenuItem[];
};

export type Class = {
  id: string;
  className: string;
  sectionName: string[];
};

export type Session = {
  id: string;
  year: number;
};
export type StudentType = Student;

export type getResultType = {
  studentId: number;
  className: string;
  session: string;
};

// type Subjects = {
//   subjectName: string;
//   marks: number;
//   grade: String;
// };

// export type ResultWithStudentInfo = {
//   id: string;
//   gpa: number;
//   position: number | null;
//   status: string;
//   className: string;
//   studentId: number;
//   year: number;
//   type: string;
//   totalMarks: number;
//   student: {
//     fullName: string;
//     fatherName: string;
//     classRoll: string;
//     section: string;
//     dob: string;
//     gender: string;
//   };
//   subjects: Subjects[];
// };

export type Student = {
  fullName: string;
  fatherName: string;
  classRoll: string;
  dob: string;
  gender: string;
};

export type Subject = {
  grade: string;
  marks: string;
  subjectName: string;
};

export type Result = {
  id: string;
  gpa: number;
  position: number | null;
  status: string;
  className: string;
  year: number;
  type: string;
  totalMarks: number;
  studentId: number;
  student: Student;
  subjects: Subject[];
};

export type ImportStudent = {
  fullName: string;
  classRoll: number;
  gender: string;
  dob: string;
  doa: string;
  mobile: number;
  bloodGroup: string;
  address: string | null;
  others: string | null;
  fatherName: string;
  motherName: string;
  fatherPhone: number;
  gurdianName: string;
  relation: string;
  gurdianPhone: number;
};

// add classvalus type
export type AddClassTypes = {
  className: string;
  sectionName: string[];
};
// add classvalus type
export type UpdateClassType = {
  id: string;
  className: string;
  sectionName: string[];
};

export type NoticesType = {
  notices: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    file: string;
  }[];
};
