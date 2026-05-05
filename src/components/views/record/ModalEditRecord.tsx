"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Edit2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import useUpdateGroupData from "@/hooks/record/useUpdateGroupData";
import { Record } from "@/types/model";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";

export function ModalEditRecord({ data }: { data: Record }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-7 h-7 border border-gray-300 rounded-full flex-center  hover:border-blue-500 dark:border-gray-600">
            <Edit2 size={14} className="text-blue-700" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-medium">Edit Catatan</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Edit catatan dengan mengisi jumlah barang
            </DialogDescription>
          </DialogHeader>
          <ProfileForm data={data} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="w-7 h-7 border border-gray-300 rounded-full flex-center  hover:border-blue-500 dark:border-gray-600">
          <Edit2 size={14} className="text-blue-700" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerDescription></DrawerDescription>
        <DrawerHeader>
          <DrawerTitle className=" font-medium mb-0">Edit Catatan</DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Edit catatan dengan mengisi jumlah barang
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" data={data} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Batal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  data,
  setOpen,
}: {
  className?: string;
  data: Record;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<{
    quantity: number;
    _id: string;
    product: string;
  }>({
    defaultValues: {
      _id: data._id || "",
      quantity: Number(data?.quantity) || 0,
      product: data?.product || "",
    },
  });
  const query = useQueryClient();

  const { mutate, isPending } = useUpdateGroupData();

  const onSubmit = (data: Record) => {
    mutate(data, {
      onSuccess: (data) => {
        query.invalidateQueries({ queryKey: ["dashboard"] });
        query.invalidateQueries({ queryKey: ["groupData"] });
        toast.success(data.message);
        setOpen(false);
      },
      onError: (error) => {
        ResponseErrorAxios(error as AxiosError);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        <FormField
          control={form.control}
          name="quantity"
          rules={{
            required: "Jumlah tidak boleh kosong.",
            min: {
              value: 1,
              message: "Jumlah tidak boleh kurang dari 1.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal block w-fit">
                Jumlah yang dijual
              </FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  type="number"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={isPending} className="py-5" type="submit">
          Simpan
        </LoadingButton>
      </form>
    </Form>
  );
}
