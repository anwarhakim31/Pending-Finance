import React, { useRef } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/components/ui/LoadingButton";
import usePostPhoto from "@/hooks/profile/usePostPhoto";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";
import { Avatar } from "@/components/ui/avatar";
import { User } from "@/types/model";
import useUpadateProfile from "@/hooks/profile/useUpadateProfile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const FormProfileView = ({
  isProfile,
  setIsProfile,
}: {
  isProfile: boolean;
  setIsProfile: (value: boolean) => void;
}) => {
  const session = useSession();
  const form = useForm<User>({
    defaultValues: {
      fullname: session.data?.user?.fullname || "",
      photo: session.data?.user?.photo || "",
      store: session.data?.user?.store || "",
      phone: session.data?.user?.phone || "",
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState(0);
  const { mutate: mutatePhoto, isPending: isPendingPhoto } = usePostPhoto(
    (value) => setProgress(value)
  );
  const { mutate: mutateProfile, isPending: isPendingProfile } =
    useUpadateProfile();

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      mutatePhoto(file, {
        onSuccess: (data) => {
          form.setValue("photo", data.url);
        },
        onError: (error) => ResponseErrorAxios(error as Error),
      });

      e.target.files = null;
    }
  };

  const onSubmit = (data: User) => {
    mutateProfile(data, {
      onSuccess: (values) => {
        console.log(values);
        setIsProfile(false);
        toast.success("Berhasil mengubah data");
        session.update({ ...session.data, user: values.data });
      },
      onError: (error) => ResponseErrorAxios(error as Error),
    });
  };

  return (
    <>
      <div className=" flex flex-col items-center mt-8">
        <Avatar
          className={`relative overflow-hidden w-20 h-20 bg-gray-200 dark:bg-black border border-gray-300 cursor-pointer ${
            isProfile ? "" : "pointer-events-none"
          }`}
          onClick={() =>
            form.watch("photo")
              ? form.setValue("photo", "")
              : inputRef.current?.click()
          }
        >
          <Image
            src={form.watch("photo") || "/user.png"}
            alt="user"
            width={100}
            height={100}
            className="object-cover object-center  rounded-full"
            priority
          />
          {isPendingPhoto && progress > 0 && (
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80 hover:opacity-50 flex items-center justify-center">
              <p className="text-white text-base">{progress}%</p>
            </div>
          )}
        </Avatar>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          disabled={!isProfile}
          onChange={handleChangeImage}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`w-full flex flex-col gap-4 mt-4 ${
            isProfile ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <FormField
            control={form.control}
            name="fullname"
            rules={{
              required: "Nama Lengkap tidak boleh kosong.",
              minLength: {
                value: 6,
                message: "Nama Lengkap minimal 6 karakter.",
              },
            }}
            render={({ field }) => (
              <FormItem className=" flex items-center">
                <FormLabel className="flex-shrink-0 mt-2.5 w-24">
                  Nama Lengkap
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    autoComplete="off"
                    type="text"
                    className={`${
                      isProfile
                        ? " border-gray-400 "
                        : "border-white shadow-none"
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="store"
            rules={{
              required: "Nama Toko tidak boleh kosong.",
              minLength: { value: 2, message: "Nama Toko minimal 2 karakter." },
            }}
            render={({ field }) => (
              <FormItem>
                <div className=" flex items-center">
                  <FormLabel className="flex-shrink-0 mt-1 w-24">
                    Nama Toko
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      autoComplete="off"
                      type="text"
                      className={`${
                        isProfile
                          ? " border-gray-400 "
                          : "border-white shadow-none"
                      }`}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            rules={{
              required: "Whatsapp tidak boleh kosong.",
              minLength: {
                value: 10,
                message: "Nomor Whatsapp minimal 10 karakter",
              },
              maxLength: {
                value: 13,
                message: "Nomor Whatsapp maksimal 13 karakter",
              },
              pattern: {
                value: /^[0-9]*$/,
                message: "Nomor Whatsapp hanya boleh angka",
              },
            }}
            render={({ field }) => (
              <FormItem className=" ">
                <div className="flex items-center">
                  <FormLabel className="flex-shrink-0 mt-1 w-24">
                    Whatsapp
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      type="text"
                      autoComplete="off"
                      className={`${
                        isProfile
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
              isProfile ? "opacity-100" : "opacity-0"
            }`}
            loading={isPendingPhoto || isPendingProfile}
          >
            Simpan
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};

export default FormProfileView;
