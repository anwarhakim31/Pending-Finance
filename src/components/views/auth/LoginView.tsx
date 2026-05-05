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
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";

import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { InputPassword } from "@/components/ui/input-password";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [isRemember, setIsRemember] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    const ls = localStorage.getItem("remember");

    if (ls) {
      form.setValue("fullname", JSON.parse(ls).fullname || "");
      form.setValue("password", JSON.parse(ls).password || "");
      setIsRemember(true);
    }
  }, [form]);

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
      router.replace(callbackUrl);
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
                  onChange={(e) => {
                    if (isRemember) {
                      localStorage.setItem(
                        "remember",
                        JSON.stringify({
                          fullname: e.target.value,
                          password: form.getValues("password"),
                        }),
                      );
                    }
                    field.onChange(e.target.value);
                  }}
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
                  onChange={(e) => {
                    if (isRemember) {
                      localStorage.setItem(
                        "remember",
                        JSON.stringify({
                          fullname: form.getValues("fullname"),
                          password: e.target.value,
                        }),
                      );
                    }
                    field.onChange(e.target.value);
                  }}
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={isRemember}
            onCheckedChange={() => {
              setIsRemember(!isRemember);

              if (isRemember) {
                localStorage.removeItem("remember");
              } else {
                localStorage.setItem(
                  "remember",
                  JSON.stringify({
                    fullname: form.getValues("fullname"),
                    password: form.getValues("password"),
                  }),
                );
              }
            }}
          />
          <Label htmlFor="remember" className="text-xs">
            Ingat saya
          </Label>
        </div>
        <LoadingButton
          type="submit"
          loading={isLoading}
          className="w-full mt-8 py-5"
        >
          Masuk
        </LoadingButton>
      </form>
    </Form>
  );
};

export default LoginView;
