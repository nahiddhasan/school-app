import { Role } from "@/app/generated/prisma";

export const publicRoutes = ["/", "/result", "/auth/new-verification"];

export const authRoutes = ["/login", "/auth/error"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const RESERVED_PATHS = ["notice", "result", "gallery"];

export const routeAccessMap: { [pattern: string]: Role[] } = {
  "/dashboard/students/admission(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/students/edit(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/students/import": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/students/view(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/students/bulk-delete(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/students(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/enrollment(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/teachers/add(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/teachers": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/exams/quiz/add(.*)": [Role.SUPERADMIN, Role.ADMIN, Role.TEACHER],
  "/dashboard/exams/quiz(.*)": [
    Role.SUPERADMIN,
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  ],
  "/dashboard/exams/result(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/schedule(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/assignments/add(.*)": [Role.TEACHER],
  "/dashboard/assignments(.*)": [
    Role.SUPERADMIN,
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  ],

  "/dashboard/announcements/add(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/announcements(.*)": [Role.SUPERADMIN, Role.ADMIN, Role.TEACHER],

  "/dashboard/events/add(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/events(.*)": [Role.SUPERADMIN, Role.ADMIN, Role.TEACHER],

  "/dashboard/reports(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/notices/add(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/notices(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/attendance/view(.*)": [Role.SUPERADMIN, Role.ADMIN, Role.TEACHER],
  "/dashboard/attendance/take(.*)": [Role.TEACHER],
  "/dashboard/attendance/asign(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/attendance(.*)": [Role.TEACHER],

  "/dashboard/classes/add-class(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/classes/all-classes(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/users/add-user(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/users/current-users(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/users/update-profile(.*)": [
    Role.SUPERADMIN,
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  ],
  "/dashboard/users(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/settings/academic-year(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/settings(.*)": [Role.SUPERADMIN, Role.ADMIN],

  "/dashboard/pages(.*)": [Role.SUPERADMIN],
  "/dashboard/sections(.*)": [Role.SUPERADMIN],
  "/dashboard/gallary(.*)": [Role.SUPERADMIN],

  // Put these at the end to avoid catching broader matches too early
  "/dashboard/admin(.*)": [Role.SUPERADMIN, Role.ADMIN],
  "/dashboard/teacher(.*)": [Role.TEACHER],
  "/dashboard/student(.*)": [Role.STUDENT],
};
