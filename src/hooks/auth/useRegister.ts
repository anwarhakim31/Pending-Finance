import instance from "@/lib/instance";
import { User } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useRegister = () => {
  return useMutation({
    mutationFn: async (values: User) => {
      const res = await instance.post("/auth/register", values);

      return res.data;
    },
  });
};

export default useRegister;
