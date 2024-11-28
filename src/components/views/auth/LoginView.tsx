"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(setNotMatch);
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
                <Input placeholder="" {...field} autoComplete="off" />
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
                <Input
                  placeholder=""
                  type="password"
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

        <Button type="submit" style={{ marginTop: "2rem" }}>
          Masuk
        </Button>
      </form>
    </Form>
  );
};

export default LoginView;
