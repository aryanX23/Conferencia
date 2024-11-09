import { Resend } from "resend";

import VerificationEmailTemplate from "../components/email-templates/EmailVerificationTemplates";

const { RESEND_API_KEY = "" } = process.env;
const resend = new Resend(RESEND_API_KEY);

import { ApiResponse } from "@/types/apiResponse";

type subjectMapType = {
	[key: string]: string
};

export type VerificationEmailProps = {
	username: string;
	otp: string;
}

type templateMapType = {
	[key: string]: (props: VerificationEmailProps) => JSX.Element;
};

const subjectMap: subjectMapType = {
	"signup-verfication": "Conferencia message | Verification Code",
};

const templateMap: templateMapType = {
	"signup-verfication": VerificationEmailTemplate,
};

export async function sendEmail(
	email: string,
	username: string,
	subject: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		const reactTemplate = templateMap[subject];

		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: subjectMap[subject],
			react: reactTemplate({ username, otp: verifyCode }),
		});

		return {
			success: true,
			message: "Verification Email sent successfully",
		};
	} catch (error) {
		console.error("Error sending verification email! ", error);
		return {
			success: false,
			message: "Failed to send verification email",
		};
	}
}
