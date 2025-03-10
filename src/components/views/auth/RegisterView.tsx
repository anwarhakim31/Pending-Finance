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
import { AxiosError } from "axios";
import useRegister from "@/hooks/auth/useRegister";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { InputPassword } from "@/components/ui/input-password";

const formSchema = z.object({
  store: z
    .string()
    .min(2, {
      message: "Nama toko harus lebih dari 2 karakter.",
    })
    .max(25, {
      message: "Nama toko harus kurang dari 25 karakter.",
    }),
  fullname: z.string().min(2, {
    message: "Nama lengkap harus lebih dari 6 karakter.",
  }),
  password: z
    .string()
    .min(2, {
      message: "Password harus lebih dari 6 karakter.",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
      message: "Password harus mengandung huruf dan angka.",
    }),
});

export function RegisterView() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store: "",
      fullname: "",
      password: "",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { mutate, isPending } = useRegister();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: async () => {
        const res = await signIn("credentials", {
          ...values,
          redirect: false,
        });

        if (res?.ok) {
          router.push(callbackUrl);
        }
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response) {
          form.setValue("fullname", "");
          form.setError("fullname", {
            message: error?.response?.data?.message,
          });
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Toko</FormLabel>
              <FormControl>
                <Input
                  placeholder="warung"
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
                  placeholder="**********"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          loading={isPending}
          style={{ marginTop: "2rem" }}
        >
          Daftar
        </LoadingButton>
      </form>
    </Form>
  );
}
