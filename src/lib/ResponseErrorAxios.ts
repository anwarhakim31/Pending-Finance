import { AxiosError } from "axios";
import { toast } from "sonner";

export const ResponseErrorAxios = (error: Error) => {
  if (error instanceof AxiosError && error.response && error.response.data) {
    return toast.error(error?.response?.data.message);
  }
};
