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
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import { InputCurrcency } from "@/components/ui/InputCurrency";
import useCreateReceive from "@/hooks/record/useCreateReceive";
import { formatDateNow } from "@/utils/helpers";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";

export function ModalRecordReceive({ isLoading }: { isLoading: boolean }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            disabled={isLoading}
            className="text-sm p-2 disabled:cursor-not-allowed  disabled:pointer-events-none dark:border-gray-400  dark:hover:border-violet-700 text-violet-700 rounded-xl border-b-2 border-gray-100 hover:border-violet-700 transition-all duration-300 ease-in-out"
          >
            Terima
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-0">
            <DialogTitle>Pendapatan Diterima</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Masukkan jumlah uang yang diterima dan tentukan tanggalnya
            </DialogDescription>
          </DialogHeader>

          <ProfileForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          disabled={isLoading}
          className="text-sm p-2 disabled:cursor-not-allowed  disabled:pointer-events-none dark:border-gray-400  dark:hover:border-violet-700 text-violet-700 rounded-xl border-b-2 border-gray-100 hover:border-violet-700 transition-all duration-300 ease-in-out"
        >
          Terima
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left mb-4">
          <DrawerTitle className=" font-medium mb-0">
            Pendapatan Diterima
          </DrawerTitle>

          <DrawerDescription className="text-xs text-muted-foreground">
            Masukkan jumlah uang yang diterima dan tentukan tanggalnya
          </DrawerDescription>
        </DrawerHeader>

        <ProfileForm className="px-4" setOpen={setOpen} />
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
  setOpen,
}: {
  className?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<{
    date: Date | null;
    total: number | undefined;
  }>({
    defaultValues: {
      date: formatDateNow() || null,
      total: 0,
    },
  });
  const [autoClose, setAutoClose] = React.useState(true);
  const query = useQueryClient();
  const { mutate, isPending } = useCreateReceive();

  const onSubmit = (value: {
    date: Date | null;
    total: number | undefined;
  }) => {
    mutate(value, {
      onSuccess: (res) => {
        query.invalidateQueries({ queryKey: ["dashboard"] });

        toast.success(res.message);
        if (autoClose) {
          setOpen(false);
        }
      },
      onError: (error) => {
        ResponseErrorAxios(error);
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
          name="date"
          rules={{ required: "Tanngal tidak boleh kosong." }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-normal block w-fit">Tanggal</FormLabel>
              <FormControl className="flex-col">
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total"
          rules={{
            required: "Total diterima tidak boleh kosong.",
            min: { value: 1, message: "Minimal total diterima adalah 1" },
            max: {
              value: 100000000,
              message: "Maksimal total diterima adalah Rp. 100.000.000",
            },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel className="font-normal block w-fit">
                Total Diterima
              </FormLabel>
              <FormControl>
                <InputCurrcency
                  type="text"
                  inputMode="numeric"
                  onFocus={(e) => e.target.select()}
                  value={
                    field.value
                      ? new Intl.NumberFormat("id-ID").format(field.value)
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    field.onChange(raw ? Number(raw) : undefined);
                  }}
                  placeholder="100.000"
                  max={100000000}
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2 my-4">
          <Checkbox
            id="terms"
            checked={autoClose}
            onCheckedChange={() => setAutoClose((value) => !value)}
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-700 font-normal mt-0.5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tutup otomatis saat selesai menyimpan
          </label>
        </div>
        <LoadingButton loading={isPending} className="mt-2 py-5" type="submit">
          Simpan
        </LoadingButton>
      </form>
    </Form>
  );
}
