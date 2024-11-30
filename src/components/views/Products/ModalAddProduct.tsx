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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { InputCurrcency } from "@/components/ui/InputCurrency";
import { Products } from "@/types/model";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import useCreateProduct from "@/hooks/product/useCreateProduct";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";

export function ModalAddProduct({ isLoading }: { isLoading: boolean }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            disabled={isLoading}
            className="text-xs flex-shrink-0 disabled:cursor-not-allowed ml-auto w-36 border border-gray-300 hover:bg-violet-100 transition-all duration-300 ease-in-out text-violet-700 py-2.5 px-2 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-white"
          >
            Tambah Barang
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Barang</DialogTitle>
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
          disabled={isLoading}
          className="text-xs flex-shrink-0 disabled:cursor-not-allowed disabled:hover:bg-white ml-auto w-36 border border-gray-300 hover:bg-violet-100 transition-all duration-300 ease-in-out text-violet-700 py-2.5 px-2 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-white"
        >
          Tambah Barang
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tambah Barang</DrawerTitle>
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
    name: string;
    price: number;
    discountPrice: number | undefined;
    discountQuantity: number | undefined;
  }>({
    defaultValues: {
      name: "",
      price: 10000,
      discountPrice: undefined,
      discountQuantity: undefined,
    },
  });
  const query = useQueryClient();
  const { isPending, mutate } = useCreateProduct();

  const onSubmit = (data: Products) => {
    if (form.watch("discountPrice") && !form.watch("discountQuantity")) {
      return form.setError("discountQuantity", {
        message: "Jumlah  tidak boleh kosong.",
      });
    }

    if (form.watch("discountQuantity") && !form.watch("discountPrice")) {
      return form.setError("discountPrice", {
        message: "Harga diskon tidak boleh kosong.",
      });
    }

    mutate(data, {
      onSuccess: (data) => {
        setOpen(false);
        query.invalidateQueries({ queryKey: ["products"] });
        toast.success(data.message);
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
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Nama barang tidak boleh kosong." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder="Makanan" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          rules={{ required: "Harga Satuan tidak boleh kosong." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Satuan</FormLabel>
              <FormControl>
                <InputCurrcency
                  placeholder="1000"
                  {...field}
                  type="number"
                  min={0}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <span className="text-xs text-muted-foreground  block">Opsional</span>
          <div className="flex gap-2 w-full">
            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Harga Diskon</FormLabel>
                  <FormControl>
                    <InputCurrcency
                      type="number"
                      placeholder="5000"
                      {...field}
                      autoComplete="off"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountQuantity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Jumlah Diskon Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3"
                      {...field}
                      type="number"
                      min={0}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
