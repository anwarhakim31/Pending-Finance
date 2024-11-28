import instance from "@/lib/instance";
import { User } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

const useForget = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) => {
  return useMutation({
    mutationFn: async (values: User) => {
      await instance.post("/auth/forget-password", values);
    },
    onSuccess,
    onError,
  });
};

export default useForget;
