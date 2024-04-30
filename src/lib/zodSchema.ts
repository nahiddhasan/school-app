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

const imageSchema = z.any();
// To not allow empty files
//   .refine((files) => files?.length >= 1, { message: "Photo is required." })
// To not allow files other than images
//   .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
//     message: ".jpg, .jpeg, .png and .webp files are accepted.",
//   })
//   // To not allow files larger than 2MB
//   .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
//     message: `Max file size is 2MB.`,
//   })
//   .optional();

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
  studentImg: imageSchema,
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

export const searchStudent = z.object({
  className: z.string().min(1, { message: "Class is required!" }),
  section: z.string().optional(),
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
  session: z
    .string({ required_error: "Select Session! " })
    .min(1, { message: "Select Session!" }),
  className: z
    .string({ required_error: "Select Class! " })
    .min(1, { message: "Select Class!" }),
  section: z
    .string({ required_error: "Select Section! " })
    .min(1, { message: "Select Class!" }),
  exam: z.enum(["Annual", "Half-Yearly"], {
    required_error: "Select Exam Type",
  }),
  file: z
    .any()
    .refine((files) => files?.length >= 1, { message: "File is required." }),
});

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Full Name is required!" }),
  file: z.any().optional(),
});

export const importStudentSchema = z.object({
  className: z
    .string({ required_error: "Select Class! " })
    .min(1, { message: "Select Class!" }),
  section: z
    .string({ required_error: "Select Section! " })
    .min(1, { message: "Select Class!" }),

  file: z
    .any()
    .refine((files) => files?.length >= 1, { message: "File is required." }),
});
