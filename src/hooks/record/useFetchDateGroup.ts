import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchDateGroup = (month: Date) => {
  return useQuery({
    queryKey: ["dateGroup", month],
    queryFn: async () => {
      const res = await instance.get("/records/dateGroup?month=" + month);
      return res.data;
    },
    staleTime: 0,
  });
};

export default useFetchDateGroup;
