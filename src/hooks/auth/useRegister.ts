import instance from "@/lib/instance";
import { User } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: User) => void;
  onError: (error: { response: { data: { message: string } } }) => void;
}) => {
  return useMutation({
    mutationFn: async (values: User) => {
      const res = await instance.post("/auth/register", values);
      return res.data;
    },
    onSuccess,
    onError,
  });
};

export default useRegister;
