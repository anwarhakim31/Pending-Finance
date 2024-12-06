"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";

import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { InputPassword } from "@/components/ui/input-password";

const formSchema = z.object({
  fullname: z.string().min(1, {
    message: "Nama lengkap tidak boleh kosong.",
  }),
  password: z.string().min(1, {
    message: "Password tidak boleh kosong.",
  }),
});

const LoginView = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      password: "",
    },
  });
  const [notMatch, setNotMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (!res?.ok) {
        setNotMatch(true);
        setIsLoading(false);
        return;
      }
      router.push(callbackUrl);
    } catch (error) {
      if (error instanceof AxiosError) {
        form.reset();
        setIsLoading(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        {notMatch && (
          <Alert variant="destructive">
            <AlertDescription className="text-center">
              Nama lengkap atau password salah
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem style={{ marginTop: "1rem" }}>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  placeholder="pending"
                  type="text"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem style={{ marginTop: "1rem" }}>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="***********"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          style={{ marginTop: "0.5rem" }}
          href="/forget-password"
          className="text-xs text-right block text-violet-700 hover:underline"
        >
          Lupa Password
        </Link>

        <LoadingButton
          type="submit"
          loading={isLoading}
          style={{ marginTop: "2rem" }}
        >
          Masuk
        </LoadingButton>
      </form>
    </Form>
  );
};

export default LoginView;
