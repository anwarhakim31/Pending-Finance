import instance from "@/lib/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteOneProduct = (id: string, url: string, keys: string) => {
  console.log(keys);

  const query = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`${url}?id=${id}`);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Berhasil menghapus data");
      query.refetchQueries({ queryKey: [`products`] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useDeleteOneProduct;
