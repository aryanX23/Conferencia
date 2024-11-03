import { z } from "zod";

export const signupSchema = z.object({
	username: z
		.string()
		.min(2, "Username must be atleast 2 characters")
		.max(20, "Username should be no more than 20 characters"),
	fullname: z
		.string()
		.min(2, "Username must be atleast 2 characters")
		.max(100, "Username should be no more than 100 characters"),
	email: z.string().email({ message: "Invalid Email Address" }),
	password: z
		.string()
		.min(6, { message: "Password must be atleast 6 characters" }),
});
