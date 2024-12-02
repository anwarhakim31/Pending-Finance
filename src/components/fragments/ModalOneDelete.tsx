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
import useDeleteOne from "@/hooks/useDeleteOne";

import { Trash } from "lucide-react";

export function ModalOneDelete({
  id,
  url,
  keys,
}: {
  id: string;
  url: string;
  keys: string[];
}) {
  const { mutate, isPending } = useDeleteOne(id, url, keys);

  const handleDelete = () => {
    mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          title="Hapus "
          className="w-7 h-7 border border-gray-300 rounded-full flex-center hover:border-red-400   dark:border-gray-600"
        >
          <Trash size={14} className=" text-red-600 " />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Data yang telah dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
