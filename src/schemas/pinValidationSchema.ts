import { z } from "zod";

export const pinValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    })
    .email({ message: "Invalid Email Address" })
    .transform((value) => value.trim().toLowerCase()),
  pin: z
    .string({
      required_error: "Pin is Required",
      invalid_type_error: "Pin must be a string",
    })
    .min(6, { message: "Password must be atleast 6 characters" })
    .max(6, { message: "Pin Must be atmost 6 digits" })
    .transform((value) => value.trim()),
  resetOtp: z.boolean().optional().default(false)
});
