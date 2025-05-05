import { User } from "@/app/generated/prisma";

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

export type StudentType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  studentId: number;
  fullName: string;
  gender: string;
  dob: string;
  doa: string;
  mobile: string;
  bloodGroup: string | null;
  studentImg: string | null;
  address: string | null;
  others: string | null;
  fatherName: string;
  motherName: string;
  fatherPhone: string;
  gurdianName: string;
  relation: string;
  gurdianPhone: string;
  enrollments: {
    id: string;
    createdAt: string;
    updatedAt: string;
    studentId: string;
    academicYearId: string;
    classId: string;
    section: string;
    status: string;
    classRoll: number;
    class?: {
      id: string;
      createdAt: string;
      updatedAt: string;
      className: string;
      sectionName: string[];
    };
    academicYear?: {
      id: string;
      createdAt: string;
      updatedAt: string;
      year: number;
      current: boolean;
    };
  }[];
  results?: {
    id: string;
    gpa: number;
    position: number | null;
    status: string;
    className: string;
    year: number;
    type: string;
    totalMarks: number;
    section: string;
    studentId: number;
    academicYear: {
      id: string;
      year: number;
    };
    subjects: {
      name: string;
      marks: string;
    }[];
  }[];
};

export type getResultType = {
  studentId: number;
  className: string;
  session: string;
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

export type UserWithoutPass = Omit<User, "password">;
