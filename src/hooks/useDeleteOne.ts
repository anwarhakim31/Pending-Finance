import instance from "@/lib/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useDeleteOne = (
  id: string,
  url: string,
  queryKeys: string[],
  pathname?: string
) => {
  const router = useRouter();
  const query = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`${url}?id=${id}`);

      return res.data;
    },
    onSuccess: () => {
      if (pathname) {
        router.replace(pathname);
      }
      toast.success("Berhasil menghapus data");
      queryKeys.forEach((key) => {
        query.refetchQueries({ queryKey: [key] });
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useDeleteOne;
