import instance from "@/lib/instance";
import { Record } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useUpdateGroupData = () => {
  return useMutation({
    mutationFn: async (data: Record) => {
      const res = await instance.patch(`/records/${data?.id as string}`, data);

      return res.data;
    },
  });
};

export default useUpdateGroupData;
