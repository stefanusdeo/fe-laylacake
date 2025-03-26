import * as yup from "yup";
import { emailRegex, passwordRegex, phoneRegex, urlRegex } from "@/utils/regex";

const req = "is required";
const short = "is too short";
const long = "is too long";
const invalid = "is invalid";

const emailSchema = yup
  .string()
  .email("Invalid email format")
  .required(`Email ${req}`)
  .max(50, `Email ${long}`)
  .matches(emailRegex, "Invalid email format");

const passwordSchema = yup.string().min(8, `Password ${short}`).max(30, `Password ${long}`);
// .matches(passwordRegex, `Invalid password format`);

const phoneSchema = yup
  .string()
  .required(`Phone number ${req}`)
  .min(6, `Phone number ${short}`)
  .max(20, `Phone number ${long}`)
  .matches(phoneRegex, `Invalid phone number format`);

export const loginSchema = yup.object().shape({
  email: emailSchema.required("Email is required"),
  password: passwordSchema.required("Password is required"),
  remember: yup.boolean().default(false).optional(),
});

export const editAccountSchema = yup.object().shape({
  username: yup.string().required(`Username ${req}`),
  phone: phoneSchema,
});

export const editPasswordSchema = yup.object().shape({
  NewPassword: passwordSchema
    .required(`New password ${req}`)
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    )
    .notOneOf([yup.ref(`OldPassword`)], `Please create a new password`),
  PasswordConfirmation: yup
    .string()
    .required(`Password confirmation is required`)
    .oneOf([yup.ref(`NewPassword`)], `New passwords do not match`),
});

export const userSchema = yup.object().shape({
  fullname: yup.string().required(`Name ${req}`),
  email: emailSchema.required("Email is required"),
  phone: phoneSchema,
  password: passwordSchema.required("Password is required"),
  role: yup.string().required(`Role ${req}`),
  PasswordConfirmation: yup
    .string()
    .required(`Password confirmation is required`)
    .oneOf([yup.ref(`password`)], `Password confirmation do not match`),
  outlet_ids: yup.mixed().optional(),
});
