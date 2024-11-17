"use client"
import callApi from "@/utils/callApiService";

export type signupPayloadType = {
  username: string,
  password: string,
  fullname: string,
  email: string,
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