"use client"
import callApi from "@/utils/callApiService";

export type signupPayloadType = {
  username: string,
  password: string,
  fullname: string,
  email: string,
}

const callSignupApi = async (payload: signupPayloadType) : Promise<object> => {
  const response = await callApi.post('/api/sign-up',
    payload,
  );

  return response?.data || {};
}

export default callSignupApi