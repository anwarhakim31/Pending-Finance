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
import { InputCurrcency } from "@/components/ui/InputCurrency";
import { Edit2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import useUpdateGroupData from "@/hooks/record/useUpdateGroupData";

export function ModalEditRecord({
  data,
}: {
  data: { id: string; quantity: number };
}) {
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
            <DialogTitle>Edit Catatan</DialogTitle>
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
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Catatan</DrawerTitle>
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
  data: { quantity: number; id: string };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<{
    quantity: number;
    id: string;
  }>({
    defaultValues: {
      id: data.id || "",
      quantity: data.quantity || 0,
    },
  });
  const query = useQueryClient();

  const { mutate, isPending } = useUpdateGroupData();

  const onSubmit = (data: { quantity: number; id: string }) => {
    mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message);
        query.invalidateQueries({ queryKey: ["groupData"] });
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
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="quantity"
          rules={{ required: "Harga Satuan tidak boleh kosong." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah yang dijual</FormLabel>
              <FormControl>
                <InputCurrcency
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

        <LoadingButton
          loading={isPending}
          style={{ marginTop: "2rem" }}
          type="submit"
        >
          Simpan
        </LoadingButton>
      </form>
    </Form>
  );
}
