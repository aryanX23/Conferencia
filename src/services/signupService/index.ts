"use client";
import callApi from "@/utils/callApiService";

export type signupPayloadType = {
  username: string;
  password: string;
  fullname: string;
  email: string;
};

export type otpVerificationPayloadType = {
  email: string | null;
  pin: string;
  resetOtp: boolean;
};

export const callSignupApi = async (
  payload: signupPayloadType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await callApi.post("/api/sign-up", payload);

  return response?.data || {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callverifyUsernameApi = async (username: string): Promise<any> => {
  const response = await callApi.get("/api/verify-username", {
    params: {
      username,
    },
  });

  return response?.data || {};
};

export const callVerifyOtp = async (
  payload: otpVerificationPayloadType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  try {
    const response = await callApi.post("/api/verify-user", payload);

    return response?.data || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return err?.response?.data || {};
  }
};
