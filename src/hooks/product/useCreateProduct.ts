import instance from "@/lib/instance";
import { Products } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (data: Products) => {
      const res = await instance.post("/product", data);

      return res.data;
    },
  });
};

export default useCreateProduct;
