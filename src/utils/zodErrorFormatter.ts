import { ZodError } from "zod";

const zodErrorFormatter = (error: ZodError): object => {
  let finalResponse: object = {};
  error.errors.forEach((err) => {
    const errorObject = {
      [err.path[0]]: err.message,
    };

    finalResponse = { ...finalResponse, ...errorObject };
  });
  return finalResponse;
}

export default zodErrorFormatter;