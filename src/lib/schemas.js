import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z
    .string()
    .min(10, "Enter a complete phone number")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Digits only (no spaces or symbols)"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[a-zA-Z]/, "Include at least one letter"),
  company: z.string().optional(),
  isAgency: z.enum(["yes", "no"], { message: "Select Yes or No" }),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function checkOptionalPassword(val, ctx) {
  if (!val || val.length === 0) return;
  if (val.length < 8) {
    ctx.addIssue({ code: "custom", message: "Use at least 8 characters", path: ["newPassword"] });
  }
  if (!/[0-9]/.test(val)) {
    ctx.addIssue({ code: "custom", message: "Include a number", path: ["newPassword"] });
  }
  if (!/[^A-Za-z0-9]/.test(val)) {
    ctx.addIssue({ code: "custom", message: "Include a symbol (e.g. ! @ #)", path: ["newPassword"] });
  }
}

export const accountSchema = z
  .object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    newPassword: z.string().optional(),
    bio: z.string().max(520, "Bio must be under 520 characters").optional(),
  })
  .superRefine((data, ctx) => {
    checkOptionalPassword(data.newPassword ?? "", ctx);
  });
