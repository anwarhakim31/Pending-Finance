import instance from "@/lib/instance";
import { Products } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useUpdateProduct = (id: string) => {
  return useMutation({
    mutationFn: async (data: Products) => {
      const res = await instance.patch(`/product?id=${id}`, data);

      return res.data;
    },
  });
};

export default useUpdateProduct;
