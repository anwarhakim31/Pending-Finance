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
import { Edit2 } from "lucide-react";
import { Products } from "@/types/model";
import useUpdateProduct from "@/hooks/product/useUpdateProduct";
import { useQueryClient } from "@tanstack/react-query";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function ModalEditProduct({ data }: { data: Products }) {
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
            <DialogTitle>Edit Barang</DialogTitle>
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
          <DrawerTitle>Edit Barang</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4" data={data} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
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
  data: Products;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<{
    name: string;
    price: number;
    discountPrice: number | undefined;
    discountQuantity: number | undefined;
  }>({
    defaultValues: {
      name: data.name || "",
      price: data.price || 0,
      discountPrice: data.discountPrice || undefined,
      discountQuantity: data.discountQuantity || undefined,
    },
  });
  const query = useQueryClient();
  const { mutate, isPending } = useUpdateProduct(data.id?.toString() || "");

  const onSubmit = (data: Products) => {
    if (form.watch("discountPrice") && !form.watch("discountQuantity")) {
      return form.setError("discountQuantity", {
        message: "Jumlah  tidak boleh kosong.",
      });
    }

    if (form.watch("discountQuantity") && !form.watch("discountPrice")) {
      return form.setError("discountPrice", {
        message: "Harga tidak boleh kosong.",
      });
    }

    mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message);
        query.invalidateQueries({ queryKey: ["products"] });
        setOpen(false);
      },
      onError: (error) => {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.data.message
        ) {
          {
            form.setError("name", {
              message: error.response.data.message,
            });
          }
        } else {
          ResponseErrorAxios(error);
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
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Nama barang tidak boleh kosong." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} autoComplete="off" />
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
                  placeholder=""
                  {...field}
                  type="number"
                  min={0}
                  step={1000}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <span className="text-xs text-gray-400  block">Opsional</span>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              rules={{ required: "Harga Satuan tidak boleh kosong." }}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Diskon</FormLabel>
                  <FormControl>
                    <InputCurrcency
                      placeholder=""
                      {...field}
                      autoComplete="off"
                      type="number"
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
                <FormItem>
                  <FormLabel>Jumlah Diskon Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
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
