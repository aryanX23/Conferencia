"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CardWrapper from "@/components/ui/card-wrapper";

import { callSignupApi, callverifyUsernameApi } from "@/services/signupService";
import { signupSchema } from "@/schemas/signupSchema";

const formSchema = signupSchema
  .extend({
    confirmPassword: z.string().min(6, { message: "Password must match" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [usernameMessage, setUsernameMessage] = React.useState(
    "This is your public display name.",
  );
  const [checkingUsername, setCheckingUsername] = React.useState(false);
  const [onSubmitLoading, setOnSubmitLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullname: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setOnSubmitLoading(true);
      const { username, email, fullname, password } = values;
      type apiResponseType = {
        success: boolean;
        message: string;
        code: string;
      };
      const apiResponse: apiResponseType = await callSignupApi({
        username,
        fullname,
        password,
        email,
      });

      if (apiResponse.success) {
        toast.success(apiResponse.message);
        router.replace(`/verify-user?email=${email}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.log(error);
    } finally {
      setOnSubmitLoading(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debouncedValue, setValue] = useDebounceValue(username, 1500);

  useEffect(() => {
    const verifyUsername = async () => {
      try {
        if (debouncedValue.length > 1) {
          setCheckingUsername(true);
          setUsernameMessage("Checking availability...");

          const verificationResponse =
            await callverifyUsernameApi(debouncedValue);

          if (verificationResponse.success) {
            setUsernameMessage(verificationResponse.message);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "An error occurred.";
        setUsernameMessage(errorMessage);
      } finally {
        setCheckingUsername(false);
      }
    };

    verifyUsername();
  }, [debouncedValue]);

  useEffect(() => {
    if (username.length === 0) {
      setUsernameMessage("This is your public display name.");
    }
  }, [username]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-800">
      <CardWrapper
        label="Create an account"
        title="Sign Up"
        backButtonHref="/sign-in"
        backButtonLabel="Already have an account? Sign in here."
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={checkingUsername}
                      placeholder="Enter Username"
                      autoComplete="off"
                      onChange={(e) => {
                        setUsername(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>{usernameMessage}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={onSubmitLoading} type="submit">
              {
                onSubmitLoading ? 
                  <>
                    <Loader2 className="animate-spin" />
                    <span>
                      Please Wait
                    </span>
                  </> : 
                  <>
                    <span>
                      Submit
                    </span>
                  </>
              }
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
