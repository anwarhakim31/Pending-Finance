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
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useForget from "@/hooks/auth/useForget";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { InputPassword } from "@/components/ui/input-password";

const formSchema = z.object({
  store: z.string().min(1, {
    message: "Nama Toko tidak boleh kosong.",
  }),

  fullname: z.string().min(1, {
    message: "Nama lengkap tidak boleh kosong.",
  }),
  newPassword: z
    .string()
    .min(6, {
      message: "Password harus lebih dari 6 karakter.",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
      message: "Password harus mengandung huruf dan angka.",
    }),
});

const ForgetPasswordView = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store: "",
      fullname: "",
      newPassword: "",
    },
  });
  const router = useRouter();
  const [notExist, setNotExist] = useState(false);

  const { mutate, isPending } = useForget({
    onSuccess: () => {
      toast.success("Password berhasil diubah.");
      form.reset();
      setNotExist(false);
      router.push("/login");
    },
    onError: () => {
      setNotExist(true);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        {notExist && (
          <Alert variant="destructive">
            <AlertDescription className="text-center">
              Akun tidak terdaftar
            </AlertDescription>
          </Alert>
        )}
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
          name="newPassword"
          render={({ field }) => (
            <FormItem style={{ marginTop: "1rem" }}>
              <FormLabel>Password Baru</FormLabel>
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
          Ganti Password
        </LoadingButton>
      </form>
    </Form>
  );
};

export default ForgetPasswordView;
