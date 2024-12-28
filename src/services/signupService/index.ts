"use client"
import callApi from "@/utils/callApiService";

export type signupPayloadType = {
  username: string,
  password: string,
  fullname: string,
  email: string,
}

export type otpVerificationPayloadType = {
  email: string | null,
  pin: string,
  resetOtp: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callSignupApi = async (payload: signupPayloadType): Promise<any> => {
  const response = await callApi.post('/api/sign-up',
    payload,
  );

  return response?.data || {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callverifyUsernameApi = async (username: string): Promise<any> => {
  const response = await callApi.get('/api/verify-username',
    {
      params: {
        username,
      },
    },
  );

  return response?.data || {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callVerifyOtp = async (payload: otpVerificationPayloadType): Promise<any> => {
  const response = await callApi.post('/api/verify-user', 
    payload
  );

  return response?.data || {};
}