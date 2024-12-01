import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchDateGroup = (month: Date) => {
  return useQuery({
    queryKey: ["dateGroup"],
    queryFn: async () => {
      const res = await instance.get("/records/dateGroup?month=" + month);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (oldData) => oldData,
  });
};

export default useFetchDateGroup;
