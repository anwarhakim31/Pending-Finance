import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchStatistic = () => {
  return useQuery({
    queryKey: ["statistic"],
    queryFn: async () => {
      const res = await instance.get("/records/statistic");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useFetchStatistic;
