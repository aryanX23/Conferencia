import { NextAuthOptions } from "next-auth";
import { isEmpty } from "lodash";
import bcrypt from "bcryptjs";
import CredentialProvider from "next-auth/providers/credentials";

import UserModel from "@/models/User";
import connectDatabase from "@/lib/databaseConnectService";

interface UserOptions {
	emailVerified?: boolean;
	password?: string;
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			async authorize(credentials: any): Promise<any> {
				await connectDatabase();

				try {
					const userDetails: UserOptions =
						(await UserModel.findOne({
							email: credentials.identifier,
						}).lean()) || {};

					if (isEmpty(userDetails)) {
						throw new Error("User not found");
					}

					if (!userDetails.emailVerified) {
						throw new Error("User not verified");
					}

					const isValidPassword = await bcrypt.compare(
						credentials.password,
						userDetails.password || ""
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					} else {
						return userDetails;
					}
				} catch (error) {
					console.error("Error authorizing user: ", error);
					throw new Error("Error authorizing user");
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.email = user.email;
				token.userId = user.userId;
				token.emailVerified = user.emailVerified;
				token.userName = user.userName;
				token.fullName = user.fullName;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.email = token.email;
				session.user.userId = token.userId;
				session.user.emailVerified = token.emailVerified;
				session.user.userName = token.userName;
				session.user.fullName = token.fullName;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
};
