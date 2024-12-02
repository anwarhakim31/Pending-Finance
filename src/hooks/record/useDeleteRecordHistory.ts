import instance from "@/lib/instance";
import { useMutation } from "@tanstack/react-query";

const useDeleteRecordHistory = () => {
  return useMutation({
    mutationFn: async (data: string[]) => {
      const res = await instance.post(`/records/history`, { dataCheck: data });

      return res.data;
    },
  });
};

export default useDeleteRecordHistory;
