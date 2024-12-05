"use client";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useDeleteGroupData from "@/hooks/record/useDeleteGroupData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";
import { useRouter } from "next/navigation";

export function ModalDeleteRecord({ id }: { id: string }) {
  const { mutate, isPending } = useDeleteGroupData();
  const query = useQueryClient();
  const router = useRouter();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        router.push("/dashboard");
        toast.success("Catatan berhasil dihapus");
        query.invalidateQueries({ queryKey: ["groupData"] });
        query.invalidateQueries({ queryKey: ["statistic"] });
        query.invalidateQueries({ queryKey: ["dateGroup"] });
      },
      onError: (error: Error) => {
        ResponseErrorAxios(error as Error);
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          title="Hapus catatan"
          className="px-2 py-2 text-white border text-xs rounded-md bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in-out dark:border-gray-600"
        >
          Hapus Catatan
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Catatan yang telah dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}> Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
