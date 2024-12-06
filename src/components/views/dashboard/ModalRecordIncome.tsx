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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Catatan</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
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
        <DrawerHeader className="text-left">
          <DrawerTitle>Tambah Catatan</DrawerTitle>
        </DrawerHeader>
        <DialogDescription></DialogDescription>
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
    product: string;
    quantity: number | string;
  }>({
    defaultValues: {
      date: null,
      product: "",
      quantity: "",
    },
  });
  const query = useQueryClient();
  const { mutate, isPending } = useCreateIncome();
  const { data, isLoading } = useFetchProduct();
  const [autoClose, setAutoClose] = React.useState(true);

  React.useEffect(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const utcDate = new Date(today.toISOString());

    form.setValue("date", utcDate);
  }, [form]);

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
        className={cn("space-y-4", className)}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            rules={{ required: "Tanngal tidak boleh kosong." }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal</FormLabel>
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
                <FormLabel>Barang</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="quantity"
          rules={{
            required: "Jumlah tidak boleh kosong.",
            min: { value: 1, message: "Jumlah minimal 1" },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Jumlah barang dijual</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  type="number"
                  max={100000000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
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
          style={{ marginTop: "1rem" }}
          type="submit"
        >
          Simpan
        </LoadingButton>
      </form>
    </Form>
  );
}
