import instance from "@/lib/instance";
import { User } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useUpadateProfile = () => {
  return useMutation({
    mutationFn: async (data: User) => {
      const res = await instance.put(`/profile`, data);

      return res.data;
    },
  });
};

export default useUpadateProfile;
