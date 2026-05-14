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
import { Products, Record } from "@/types/model";

import SelectSearchOption from "@/components/ui/select-search-option";
import { Input } from "@/components/ui/input";
import useFetchProduct from "@/hooks/product/useFetchProduct";
import useCreateIncome from "@/hooks/record/useCreateIncome";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateNow } from "@/utils/helpers";

export function ModalRecordIncome({ isLoading }: { isLoading: boolean }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Catat Pendapatan"
            disabled={isLoading}
            className="text-sm p-2 disabled:cursor-not-allowed dark:border-gray-400  disabled:pointer-events-none dark:hover:border-violet-700 text-violet-700 rounded-xl border-b-2 border-gray-100 hover:border-violet-700 transition-all duration-300 ease-in-out"
          >
            Tambah
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-fit">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-medium">Tambah Catatan</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Masukkan jumlah barang yang dijual dan tentukan tanggalnya
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
          aria-label="Catat Pendapatan"
          disabled={isLoading}
          className="text-sm p-2 disabled:cursor-not-allowed  disabled:pointer-events-none dark:border-gray-400  dark:hover:border-violet-700 text-violet-700 rounded-xl border-b-2 border-gray-100 hover:border-violet-700 transition-all duration-300 ease-in-out"
        >
          Tambah
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left mb-4">
          <DrawerTitle className=" font-medium mb-0">
            Tambah Catatan
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Masukkan jumlah barang yang dijual dan tentukan tanggalnya
          </DrawerDescription>
        </DrawerHeader>

        <DrawerContent className="h-fit">
          <ProfileForm className="px-4" setOpen={setOpen} />
        </DrawerContent>
        <DrawerFooter className="py-6">
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
    product: string;
    quantity: number | string;
  }>({
    defaultValues: {
      date: formatDateNow() || null,
      product: "",
      quantity: "",
    },
  });
  const query = useQueryClient();
  const { mutate, isPending } = useCreateIncome();
  const { data, isLoading } = useFetchProduct();
  const [autoClose, setAutoClose] = React.useState(true);

  const onSubmit = (value: Record) => {
    mutate(value, {
      onSuccess: (res) => {
        query.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success(res.message);
        if (autoClose) {
          setOpen(false);
        }
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
          name="product"
          rules={{ required: "Barang tidak boleh kosong." }}
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel className="font-normal block w-fit">Barang</FormLabel>
              <FormControl>
                <SelectSearchOption
                  field={field}
                  data={data?.data?.map((item: Products) => ({
                    id: item._id,
                    value: item.name,
                  }))}
                  isLoading={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          rules={{
            required: "Jumlah barang tidak boleh kosong.",
            min: { value: 1, message: "Jumlah barang minimal 1" },
            max: {
              value: 100000000,
              message: "Jumlah barang maksimal 100.000.000",
            },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel className="font-normal block w-fit">
                Jumlah barang dijual
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  type="number"
                  {...field}
                  min={0}
                  inputMode="numeric"
                  max={10000}
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
            className="text-xs text-gray-700 font-normal  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tutup otomatis saat selesai menyimpan
          </label>
        </div>
        <LoadingButton
          loading={isPending || isLoading}
          className="mt-2 py-5"
          type="submit"
        >
          Simpan
        </LoadingButton>
      </form>
    </Form>
  );
}
