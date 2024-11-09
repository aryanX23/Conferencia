import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    email: string;
    emailVerified: boolean;
    userId: string;
    userName: string;
    fullName: string;
  }

  interface Session {
		user: {
			_id?: string;
			email?: string;
			emailVerified?: boolean | Date | null | undefined;
			userId?: string;
			userName?: string;
			fullName?: string;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
    _id: string;
    email: string;
    emailVerified: boolean | Date | null | undefined;
    userId: string;
    userName: string;
    fullName: string;
	}
}