import { Prisma, ReusltStatus, User } from "@/app/generated/prisma";

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
  studentId: number;
  createdAt: string;
  updatedAt: string;
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
  slug: string;
};

export type UserWithoutPass = Omit<User, "password">;

export type EnrollmentData = {
  studentId: number;
  fullName: string;
  classRoll: number;
  className: string;
  section: string;
  gpa: number | null;
  position: number | null;
  status: ReusltStatus;
};

export type WeeklyScheduleFull = {
  id: string;
  classId: string;
  section: string;
  teacherId: number;
  subjectId: string;
  dayOfWeek: number; // 0 = Sunday, ..., 6 = Saturday
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "08:45"
  class: { className: string };
  subject: { name: string };
  teacher: { name: string };
};

export type BigCalendarEvent = {
  id: string;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
};

export type TeacherType = Prisma.TeacherGetPayload<{
  include: {
    user: true;
    schedules: {
      include: {
        class: true;
        subject: true;
      };
    };
  };
}>;
