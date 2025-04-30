import { ExamType } from "@/app/generated/prisma";
import { z } from "zod";
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_PDF_FILE_TYPES = ["application/pdf"];
const ACCEPTED_CSV_FILE_TYPES = ["text/csv"];

const imageValidateOptional =
  typeof window === "undefined"
    ? z.any()
    : z
        .instanceof(FileList)
        .optional()

        .refine(
          (file) =>
            file?.length == 1
              ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
                ? true
                : false
              : true,
          "jpg, .jpeg, .png and .webp files are accepted."
        )
        .refine(
          (file) =>
            file?.length == 1
              ? file[0]?.size <= MAX_FILE_SIZE
                ? true
                : false
              : true,
          "Max file size is 2MB"
        );

const imageValidate =
  typeof window === "undefined"
    ? z.any()
    : z
        .instanceof(FileList)
        // To not allow empty files
        .refine((files) => files?.length == 1, {
          message: "File is required",
        })
        //To not allow files other than images
        .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type), {
          message: ".jpg, .jpeg, .png and .webp files are accepted.",
        })
        //To not allow files larger than 2MB
        .refine((files) => files[0]?.size <= MAX_FILE_SIZE, {
          message: `Max file size is 2MB.`,
        });

const pdfValidate =
  typeof window === "undefined"
    ? z.any()
    : z
        .instanceof(FileList)
        // To not allow empty files
        .refine((files) => files?.length == 1, {
          message: "File is required",
        })
        //To not allow files other than images
        .refine((files) => ACCEPTED_PDF_FILE_TYPES.includes(files[0]?.type), {
          message: "Only PDF files are accepted.",
        });

const csvValidate =
  typeof window === "undefined"
    ? z.any()
    : z
        .instanceof(FileList)
        // To not allow empty files
        .refine((files) => files?.length == 1, {
          message: "File is required",
        })
        //To not allow files other than csv
        .refine((files) => ACCEPTED_CSV_FILE_TYPES.includes(files[0]?.type), {
          message: "Only CSV files are accepted.",
        });

const phoneValidate = z
  .string({
    required_error: "Mobile number is required",
  })
  .refine((phone) => phoneRegex.test(phone), "Invalid phone number");

export const admissionSchema = z.object({
  classRoll: z.string().min(1, { message: "Class Roll is required!" }),
  className: z.string().min(1, { message: "Class is required!" }),
  section: z.string().min(1, { message: "Class Section is required!" }),
  fullName: z.string().min(1, { message: "Name is required!" }),
  gender: z.string().min(1, { message: "Gender is required!" }),
  dob: z.string().min(1, { message: "Date of Birth is required!" }),
  doa: z.string().min(1, { message: "Admission date is required!" }),
  mobile: z
    .string()
    .min(1, { message: "Phone Number is required!" })
    .regex(phoneRegex, "Invalid Number!"),
  bloodGroup: z.string().optional(),
  studentImg: imageValidate,
  address: z.string().optional(),
  others: z.string().optional(),
  fatherName: z.string().min(1, { message: "Father Name is required!" }),
  motherName: z.string().min(1, { message: "Mother Name is required!" }),
  fatherPhone: z
    .string()
    .min(1, { message: "Phone Number is required!" })
    .regex(phoneRegex, "Invalid Number!"),
  gurdianName: z.string().min(1, { message: "Gurdian Name is required!" }),
  relation: z.string().min(1, { message: "Relation is required!" }),
  gurdianPhone: z
    .string()
    .min(1, { message: "Phone Number is required!" })
    .regex(phoneRegex, "Invalid Number!"),
});

export const newAdmissionSchema = z.object({
  fullName: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, { message: "Name is required!" }),
  classRoll: z
    .number({
      invalid_type_error: "Class Roll must be a number",
      required_error: "Class Roll is required!",
    })
    .min(1, { message: "Class Roll is required!" }),
  className: z
    .string({
      required_error: "Class is required!",
    })
    .min(1, { message: "Class is required!" }),
  section: z
    .string({
      required_error: "Class Section is required!",
    })
    .min(1, { message: "Class Section is required!" }),
  gender: z
    .string({
      required_error: "Gender is required!",
    })
    .min(1, { message: "Gender is required!" }),
  dob: z.date({
    required_error: "Date of Birth is required!",
  }),
  doa: z.date({
    required_error: "Admission date is required!",
  }),
  mobile: phoneValidate,
  bloodGroup: z.string().optional(),
  studentImg: imageValidateOptional,
  address: z.string().optional(),
  others: z.string().optional(),
  fatherName: z
    .string({
      required_error: "Father's Name is required!",
    })
    .min(1, { message: "Father's Name is required!" }),
  motherName: z
    .string({
      required_error: "Mother's Name is required!",
    })
    .min(1, { message: "Mother's Name is required!" }),
  fatherPhone: phoneValidate,
  gurdianName: z
    .string({
      required_error: "Gurdian Name is required!",
    })
    .min(1, { message: "Gurdian Name is required!" }),
  relation: z
    .string({
      required_error: "Student relation is required!",
    })
    .min(1, { message: "Student relation is required!" }),
  gurdianPhone: phoneValidate,
});

export const searchStudent = z.object({
  className: z.string().min(1, { message: "Class is required!" }),
  section: z.string().optional(),
  search: z.string().optional(),
});

export const searchFilter = z.object({
  pageSize: z.number().optional(),
  page: z.number().optional(),
  search: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
});

// export const getResultSchema = z.object({
//   studentId: z
//     .number({
//       required_error: "StudentId is required",
//       invalid_type_error: "StudentId must be a number",
//     })
//     .min(1, { message: "StudentId is required!" }),
//   className: z.string().min(1, { message: "Class is required!" }),
//   session: z
//     .number({
//       required_error: "Year is required",
//       invalid_type_error: "Year must be a number",
//     })
//     .min(1, { message: "Year is required!" }),
// });

export const getResultSchema = z.object({
  studentId: z
    .number({
      invalid_type_error: "StudentId is required!",
    })
    .min(1, { message: "StudentId is required!" }),
  className: z.string().min(1, { message: "Class is required!" }),
  session: z.number({ coerce: true }).min(1, { message: "Year is required!" }),
  exam: z.enum(["Annual", "Half-Yearly"]),
});

export const userSchema = z.object({
  name: z.string().min(1, { message: "Full Name is required!" }),
  email: z.string().min(1, { message: "Email is required!" }).email(),
  password: z.string().min(1, { message: "password is required!" }),
  role: z.enum(["ADMIN", "TEACHER", "USER"]),
});

export const uploadResultSchema = z.object({
  className: z
    .string({ required_error: "Select Class! " })
    .min(1, { message: "Select Class!" }),
  section: z
    .string({ required_error: "Select Section! " })
    .min(1, { message: "Select Class!" }),
  examType: z.enum([ExamType.MIDTERM, ExamType.FINAL], {
    required_error: "Select Exam Type",
  }),
  file: csvValidate,
});

export const SampleResultSchema = z.object({
  className: z
    .string({ required_error: "Select Class! " })
    .min(1, { message: "Select Class!" }),
  section: z
    .string({ required_error: "Select Section! " })
    .min(1, { message: "Select Class!" }),
});

export const updateProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Full Name is required!" }),
  file: imageValidateOptional,
});

export const importStudentSchema = z.object({
  className: z
    .string({ required_error: "Select Class! " })
    .min(1, { message: "Select Class!" }),
  section: z
    .string({ required_error: "Select Section! " })
    .min(1, { message: "Select Class!" }),
  file: csvValidate,
});

export const updateUserSchema = z.object({
  id: z.string().min(1, { message: "Id is required!" }),
  name: z.string().min(1, { message: "Full Name is required!" }),
  email: z.string().min(1, { message: "Email is required!" }).email(),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "TEACHER", "USER"]),
});

export const addClassSchema = z.object({
  className: z.string().min(1, { message: "ClassName is required!" }),
});

export const searchStudentReport = z.object({
  className: z.string().optional(),
  section: z.string().optional(),
});

export const addNoticeSchema = z.object({
  title: z.string().min(1, { message: "Notice Title is required!" }),
  file: z.string().min(1, { message: "File is required!" }),
});
