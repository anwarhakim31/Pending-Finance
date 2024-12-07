import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const fetchData = async (month: Date) => {
  const [resStatistic, resDateGroup] = await Promise.all([
    instance.get("/records/statistic"),
    instance.get("/records/dateGroup?month=" + month),
  ]);
  return { resStatistic: resStatistic.data, resGroup: resDateGroup.data };
};

const useFetchDashboard = (month: Date) => {
  return useQuery({
    queryKey: ["dashboard", { month }],
    queryFn: async () => fetchData(month),
    staleTime: 5 * 60 * 1000,
    placeholderData: (oldData) => oldData,
  });
};

export default useFetchDashboard;
