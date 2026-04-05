
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  email: 'email',
  password: 'password',
  name: 'name',
  image: 'image',
  role: 'role',
  isDisabled: 'isDisabled',
  teacherId: 'teacherId',
  studentId: 'studentId',
  schoolId: 'schoolId'
};

exports.Prisma.TeacherScalarFieldEnum = {
  teacherId: 'teacherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  phone: 'phone',
  email: 'email',
  subject: 'subject',
  designation: 'designation',
  department: 'department',
  joinedAt: 'joinedAt',
  dob: 'dob',
  gender: 'gender',
  address: 'address',
  bloodGroup: 'bloodGroup',
  profileImg: 'profileImg',
  subjectId: 'subjectId',
  schoolId: 'schoolId'
};

exports.Prisma.StudentScalarFieldEnum = {
  studentId: 'studentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  fullName: 'fullName',
  gender: 'gender',
  dob: 'dob',
  doa: 'doa',
  mobile: 'mobile',
  bloodGroup: 'bloodGroup',
  studentImg: 'studentImg',
  address: 'address',
  others: 'others',
  fatherName: 'fatherName',
  motherName: 'motherName',
  fatherPhone: 'fatherPhone',
  gurdianName: 'gurdianName',
  relation: 'relation',
  gurdianPhone: 'gurdianPhone',
  schoolId: 'schoolId'
};

exports.Prisma.AcademicYearScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  year: 'year',
  current: 'current',
  schoolId: 'schoolId'
};

exports.Prisma.ClassScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  className: 'className',
  sectionName: 'sectionName',
  schoolId: 'schoolId'
};

exports.Prisma.AssignedAttendanceTeacherScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  teacherId: 'teacherId',
  classId: 'classId',
  section: 'section',
  schoolId: 'schoolId'
};

exports.Prisma.AttendanceSessionScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  date: 'date',
  classId: 'classId',
  section: 'section',
  teacherId: 'teacherId',
  schoolId: 'schoolId'
};

exports.Prisma.AttendanceRecordScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  sessionId: 'sessionId',
  studentId: 'studentId',
  status: 'status',
  note: 'note',
  schoolId: 'schoolId'
};

exports.Prisma.SubjectScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  schoolId: 'schoolId'
};

exports.Prisma.EnrollmentScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  studentId: 'studentId',
  academicYearId: 'academicYearId',
  classId: 'classId',
  section: 'section',
  status: 'status',
  classRoll: 'classRoll',
  schoolId: 'schoolId'
};

exports.Prisma.ResultScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  gpa: 'gpa',
  status: 'status',
  type: 'type',
  totalMarks: 'totalMarks',
  position: 'position',
  academicYearId: 'academicYearId',
  classId: 'classId',
  section: 'section',
  studentId: 'studentId',
  subjects: 'subjects',
  schoolId: 'schoolId'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  desc: 'desc',
  date: 'date',
  startTime: 'startTime',
  endTime: 'endTime',
  classId: 'classId',
  schoolId: 'schoolId'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  desc: 'desc',
  classId: 'classId',
  schoolId: 'schoolId'
};

exports.Prisma.WeeklyScheduleScalarFieldEnum = {
  id: 'id',
  classId: 'classId',
  section: 'section',
  teacherId: 'teacherId',
  subjectId: 'subjectId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  schoolId: 'schoolId'
};

exports.Prisma.NoticeScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  file: 'file',
  schoolId: 'schoolId'
};

exports.Prisma.SchoolInfoScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  domainPrefix: 'domainPrefix',
  principalName: 'principalName',
  address: 'address',
  phone: 'phone',
  email: 'email',
  website: 'website',
  logoUrl: 'logoUrl',
  description: 'description',
  establishedYear: 'establishedYear',
  motto: 'motto',
  mission: 'mission',
  vision: 'vision',
  superAdminId: 'superAdminId'
};

exports.Prisma.SliderImageScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  title: 'title',
  imageUrl: 'imageUrl',
  description: 'description',
  schoolId: 'schoolId'
};

exports.Prisma.GalleryImageScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  title: 'title',
  imageUrl: 'imageUrl',
  description: 'description',
  schoolId: 'schoolId'
};

exports.Prisma.HighlightScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  title: 'title',
  description: 'description',
  iconUrl: 'iconUrl',
  schoolId: 'schoolId'
};

exports.Prisma.FacilityScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  title: 'title',
  description: 'description',
  imageUrl: 'imageUrl',
  schoolId: 'schoolId'
};

exports.Prisma.TestimonialScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  author: 'author',
  role: 'role',
  message: 'message',
  imageUrl: 'imageUrl',
  schoolId: 'schoolId'
};

exports.Prisma.PageScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  schoolId: 'schoolId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
};

exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
  ONLEAVE: 'ONLEAVE'
};

exports.EnrollmentStatus = exports.$Enums.EnrollmentStatus = {
  ADMITTED: 'ADMITTED',
  PROMOTED: 'PROMOTED',
  REPEATED: 'REPEATED',
  LEFT: 'LEFT'
};

exports.ReusltStatus = exports.$Enums.ReusltStatus = {
  PASSED: 'PASSED',
  FAILED: 'FAILED'
};

exports.ExamType = exports.$Enums.ExamType = {
  MIDTERM: 'MIDTERM',
  FINAL: 'FINAL'
};

exports.Prisma.ModelName = {
  User: 'User',
  Teacher: 'Teacher',
  Student: 'Student',
  AcademicYear: 'AcademicYear',
  Class: 'Class',
  AssignedAttendanceTeacher: 'AssignedAttendanceTeacher',
  AttendanceSession: 'AttendanceSession',
  AttendanceRecord: 'AttendanceRecord',
  Subject: 'Subject',
  Enrollment: 'Enrollment',
  Result: 'Result',
  Event: 'Event',
  Announcement: 'Announcement',
  WeeklySchedule: 'WeeklySchedule',
  Notice: 'Notice',
  SchoolInfo: 'SchoolInfo',
  SliderImage: 'SliderImage',
  GalleryImage: 'GalleryImage',
  Highlight: 'Highlight',
  Facility: 'Facility',
  Testimonial: 'Testimonial',
  Page: 'Page'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
