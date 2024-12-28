"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { callVerifyOtp } from "@/services/signupService";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function VerifyUser() {
  const router = useRouter();
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);

  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setOnSubmitLoading(true);
      const { pin } = data;

      const response = await callVerifyOtp({
        email: emailFromParams,
        pin,
        resetOtp: false,
      });

      const { success = false, code } = response;

      if (success) {
        toast.success("OTP Verification Successful, Sign In to Continue")
        router.replace("/sign-up"); //change this to sign in page route
      } else {
        switch (code) {
          case "NOT_FOUND": {
            
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setOnSubmitLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/3 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Verify your OTP</CardTitle>
                <CardDescription>
                  Please enter the six-digit code sent to your registered email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          {...field}
                          pattern={REGEXP_ONLY_DIGITS}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={onSubmitLoading}
                  className="mt-5"
                  type="submit"
                >
                  {onSubmitLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <span>Please wait</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}
