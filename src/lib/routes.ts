import { Role } from "@/app/generated/prisma";

export const publicRoutes = ["/", "/result", "/auth/new-verification"];

export const authRoutes = ["/login", "/auth/error"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const routeAccessMap: { [pattern: string]: Role[] } = {
  "/dashboard/students/admission(.*)": [Role.ADMIN],
  "/dashboard/students/edit(.*)": [Role.ADMIN],
  "/dashboard/students/import": [Role.ADMIN],
  "/dashboard/students/view(.*)": [Role.ADMIN],
  "/dashboard/students/bulk-delete(.*)": [Role.ADMIN],
  "/dashboard/students(.*)": [Role.ADMIN],

  "/dashboard/enrollment(.*)": [Role.ADMIN],

  "/dashboard/teachers/add(.*)": [Role.ADMIN],
  "/dashboard/teachers": [Role.ADMIN],

  "/dashboard/exams/quiz/add(.*)": [Role.ADMIN, Role.TEACHER],
  "/dashboard/exams/quiz(.*)": [Role.ADMIN, Role.TEACHER, Role.STUDENT],
  "/dashboard/exams/result(.*)": [Role.ADMIN],

  "/dashboard/schedule(.*)": [Role.ADMIN],

  "/dashboard/assignments/add(.*)": [Role.TEACHER],
  "/dashboard/assignments(.*)": [Role.ADMIN, Role.TEACHER, Role.STUDENT],

  "/dashboard/announcements/add(.*)": [Role.ADMIN],
  "/dashboard/announcements(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/events/add(.*)": [Role.ADMIN],
  "/dashboard/events(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/reports(.*)": [Role.ADMIN],

  "/dashboard/notices/add(.*)": [Role.ADMIN],
  "/dashboard/notices(.*)": [Role.ADMIN],

  "/dashboard/attendance/view(.*)": [Role.ADMIN, Role.TEACHER],
  "/dashboard/attendance/take(.*)": [Role.TEACHER],
  "/dashboard/attendance/asign(.*)": [Role.ADMIN],
  "/dashboard/attendance(.*)": [Role.TEACHER],

  "/dashboard/classes/add-class(.*)": [Role.ADMIN],
  "/dashboard/classes/all-classes(.*)": [Role.ADMIN],

  "/dashboard/users/add-user(.*)": [Role.ADMIN],
  "/dashboard/users/current-users(.*)": [Role.ADMIN],
  "/dashboard/users/update-profile(.*)": [
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  ],
  "/dashboard/users(.*)": [Role.ADMIN],

  "/dashboard/settings/academic-year(.*)": [Role.ADMIN],

  "/dashboard/settings(.*)": [Role.ADMIN],

  // Put these at the end to avoid catching broader matches too early
  "/dashboard/admin(.*)": [Role.ADMIN],
  "/dashboard/teacher(.*)": [Role.TEACHER],
  "/dashboard/student(.*)": [Role.STUDENT],
};
