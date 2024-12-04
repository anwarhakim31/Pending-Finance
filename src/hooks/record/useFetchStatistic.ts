import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchStatistic = () => {
  return useQuery({
    queryKey: ["statistic"],
    queryFn: async () => {
      const res = await instance.get("/records/statistic");
      return res.data;
    },
    staleTime: 0,
    enabled: true,
  });
};

export default useFetchStatistic;
