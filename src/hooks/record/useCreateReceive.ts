import instance from "@/lib/instance";
import { Record } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useCreateReceive = () => {
  return useMutation({
    mutationFn: async (data: Record) => {
      const res = await instance.post("/records/receive", data);

      return res.data;
    },
  });
};

export default useCreateReceive;
