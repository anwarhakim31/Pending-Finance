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
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import { InputCurrcency } from "@/components/ui/InputCurrency";
import useCreateReceive from "@/hooks/record/useCreateReceive";

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
          <DialogHeader>
            <DialogTitle>Pendapatan Diterima</DialogTitle>
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
          disabled={isLoading}
          className="text-sm p-2 disabled:cursor-not-allowed  disabled:pointer-events-none dark:border-gray-400  dark:hover:border-violet-700 text-violet-700 rounded-xl border-b-2 border-gray-100 hover:border-violet-700 transition-all duration-300 ease-in-out"
        >
          Terima
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Pendapatan Diterima</DrawerTitle>
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
    total: number;
  }>({
    defaultValues: {
      date: null,
      total: 0,
    },
  });
  const query = useQueryClient();
  const { mutate, isPending } = useCreateReceive();

  React.useEffect(() => {
    form.setValue("date", new Date());
  }, [form]);

  const onSubmit = (value: { date: Date | null; total: number }) => {
    mutate(value, {
      onSuccess: (res) => {
        query.invalidateQueries({ queryKey: ["dashboard"] });
        // query.invalidateQueries({ queryKey: ["recordHistory"] });
        toast.success(res.message);
        setOpen(false);
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
            name="total"
            rules={{
              required: "Total tidak boleh kosong.",
              min: { value: 1, message: "Minimal total adalah 1" },
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col ">
                <FormLabel>Total Diterima</FormLabel>
                <FormControl>
                  <InputCurrcency
                    {...field}
                    type="number"
                    placeholder="1000"
                    max={100000000}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
