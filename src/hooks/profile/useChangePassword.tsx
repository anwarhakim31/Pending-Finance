import instance from "@/lib/instance";
import { useMutation } from "@tanstack/react-query";

const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const res = await instance.post("/profile", data);

      return res.data;
    },
  });
};

export default useChangePassword;
