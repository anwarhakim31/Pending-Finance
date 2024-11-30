import instance from "@/lib/instance";
import { useMutation } from "@tanstack/react-query";

const useUpdateGroupData = () => {
  return useMutation({
    mutationFn: async (data: { id: string; quantity: number }) => {
      const res = await instance.patch(`/records/${data?.id as string}`, data);

      return res.data;
    },
  });
};

export default useUpdateGroupData;
