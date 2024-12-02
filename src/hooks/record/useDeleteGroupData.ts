import instance from "@/lib/instance";
import { useMutation } from "@tanstack/react-query";

const useDeleteGroupData = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await instance.delete(`/records?recordId=${id}`);

      return res.data;
    },
  });
};

export default useDeleteGroupData;
