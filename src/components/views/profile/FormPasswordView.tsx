import React, { useEffect, useRef } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { LoadingButton } from "@/components/ui/LoadingButton";

import useChangePassword from "@/hooks/profile/useChangePassword";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { InputPassword } from "@/components/ui/input-password";

const FormPasswordView = ({
  isPassword,
  setIsPassword,
}: {
  isPassword: boolean;
  setIsPassword: (value: boolean) => void;
}) => {
  const changeRef = useRef<HTMLFormElement | null>(null);
  const form = useForm<{ oldPassword: string; newPassword: string }>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const { mutate, isPending } = useChangePassword();

  const onSubmit = (data: { oldPassword: string; newPassword: string }) => {
    mutate(data, {
      onSuccess: () => {
        setIsPassword(false);
        toast.success("Berhasil mengganti password");
        form.reset();
      },
      onError: (error) => {
        if (
          error instanceof AxiosError &&
          error?.response?.data &&
          error?.response?.data.message
        ) {
          console.log(error?.response?.data.message);
          form.setError(
            "oldPassword",
            { message: error?.response?.data.message },
            { shouldFocus: true }
          );
        }
      },
    });
  };

  useEffect(() => {
    if (isPassword && changeRef.current) {
      changeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isPassword]);

  return (
    <Form {...form}>
      <form
        ref={changeRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className={`w-full flex flex-col gap-4 mb-8 mt-4 ${
          isPassword ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <FormField
          control={form.control}
          name="oldPassword"
          rules={{
            required: "Password tidak boleh kosong.",
          }}
          render={({ field }) => (
            <FormItem className=" ">
              <div className=" flex items-center">
                <FormLabel className="flex-shrink-0  w-24">
                  Password Lama
                </FormLabel>

                <FormControl>
                  <InputPassword
                    placeholder="***********"
                    {...field}
                    autoComplete="off"
                    className={`${
                      isPassword
                        ? " border-gray-400 "
                        : "border-white shadow-none"
                    }`}
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          rules={{
            required: "Password tidak boleh kosong.",
            minLength: {
              value: 6,
              message: "Password minimal 6 karakter.",
            },
            pattern: {
              value: /^[a-zA-Z0-9]+$/g,
              message: "Password berupa huruf dan angka.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <div className=" flex items-center">
                <FormLabel className="flex-shrink-0  w-24">
                  Password Baru
                </FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder="***********"
                    {...field}
                    autoComplete="off"
                    className={`${
                      isPassword
                        ? " border-gray-400 "
                        : "border-white shadow-none"
                    }`}
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          aria-label="simpan"
          className={`w-max mt-4 text-xs ${
            isPassword ? "opacity-100" : "opacity-0"
          }`}
          loading={isPending}
        >
          Simpan
        </LoadingButton>
      </form>
    </Form>
  );
};

export default FormPasswordView;
