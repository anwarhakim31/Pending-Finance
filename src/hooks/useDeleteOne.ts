import instance from "@/lib/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteOneProduct = (id: string, url: string, queryKeys: string[]) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`${url}?id=${id}`);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Berhasil menghapus data");
      queryKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useDeleteOneProduct;
