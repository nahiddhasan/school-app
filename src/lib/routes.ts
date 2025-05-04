import { Role } from "@/app/generated/prisma";

export const publicRoutes = ["/", "/result", "/auth/new-verification"];

export const authRoutes = ["/login", "/auth/error"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const routeAccessMap: { [pattern: string]: Role[] } = {
  "/dashboard/students/admission(.*)": [Role.ADMIN, Role.TEACHER],
  "/dashboard/students/edit(.*)": [Role.ADMIN],
  "/dashboard/students/import": [Role.ADMIN],
  "/dashboard/students/view(.*)": [Role.ADMIN, Role.TEACHER],
  "/dashboard/students/bulk-delete(.*)": [Role.ADMIN],
  "/dashboard/students(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/enrollment(.*)": [Role.ADMIN],
  "/dashboard/result(.*)": [Role.ADMIN],

  "/dashboard/assignments/add(.*)": [Role.TEACHER],
  "/dashboard/assignments(.*)": [Role.ADMIN, Role.TEACHER, Role.STUDENT],

  "/dashboard/anouncements/add(.*)": [Role.ADMIN],
  "/dashboard/anouncements(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/events/add(.*)": [Role.ADMIN],
  "/dashboard/events(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/reports(.*)": [Role.ADMIN],

  "/dashboard/notices/add(.*)": [Role.ADMIN],
  "/dashboard/notices": [Role.ADMIN, Role.TEACHER],

  "/dashboard/classes/add-class(.*)": [Role.ADMIN],
  "/dashboard/classes/all-classes(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/users/add-user(.*)": [Role.ADMIN],
  "/dashboard/users/current-users(.*)": [Role.ADMIN],
  "/dashboard/users/update-profile(.*)": [
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  ],

  "/dashboard/settings/add-class(.*)": [Role.ADMIN],
  "/dashboard/settings/all-classes(.*)": [Role.ADMIN, Role.TEACHER],

  "/dashboard/settings/(.*)": [Role.ADMIN, Role.TEACHER],

  // Put these at the end to avoid catching broader matches too early
  "/dashboard/admin(.*)": [Role.ADMIN],
  "/dashboard/teacher(.*)": [Role.TEACHER],
  "/dashboard/student(.*)": [Role.STUDENT],
};
