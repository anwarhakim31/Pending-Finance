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

import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import useDeleteRecordHistory from "@/hooks/record/useDeleteRecordHistory";
import { toast } from "sonner";
import { ResponseErrorAxios } from "@/lib/ResponseErrorAxios";

export function ModalDeleteHistory({
  dataCheck,
  setDataCheck,
}: {
  dataCheck: string[];
  setDataCheck: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { mutate, isPending } = useDeleteRecordHistory();
  const query = useQueryClient();

  const handleDelete = () => {
    mutate(dataCheck, {
      onSuccess: () => {
        query.invalidateQueries({ queryKey: ["dashboard"] });
        query.invalidateQueries({ queryKey: ["history"] });
        toast.success("Riwayat berhasil dihapus");
        setDataCheck([]);
      },
      onError: (error: Error) => ResponseErrorAxios(error as Error),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-label="hapus semua"
          title="Hapus Semua"
          disabled={dataCheck.length === 0}
          className={`w-6 h-6 rounded-md  bg-red-500 flex items-center justify-center ${
            dataCheck.length > 0
              ? "opacity-100  pointer-events-auto  "
              : "opacity-0  pointer-events-auto"
          } `}
        >
          <Trash size={18} color="#fff" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Semua Riwayat yang dipilih akan dihapus dan tidak dapat
            dikembalikan.
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
