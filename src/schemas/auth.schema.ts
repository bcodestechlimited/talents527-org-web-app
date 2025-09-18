import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const SigninSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const SignupSchema = z
  .object({
    orgName: z.string().min(1, { message: "Organisation name is required" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Organisation email is required" }),
    password: z
      .string()
      .min(8, { message: "Minimum 6 characters required" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    retypedPassword: z
      .string()
      .min(1, { message: "Please retype your password" }),
  })
  .refine((data) => data.password === data.retypedPassword, {
    message: "Passwords do not match",
    path: ["retypedPassword"],
  });

export const OtpSchema = z.object({
  code: z.string().min(4, "Code must be 4 digits"),
});
