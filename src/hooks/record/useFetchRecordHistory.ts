import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchRecordHistory = (dateFrom: Date, dateTo: Date) => {
  return useQuery({
    queryKey: ["history", { dateFrom, dateTo }],
    queryFn: async () => {
      const res = await instance.get(
        "/records/history?page=" + "&from=" + dateFrom + "&to=" + dateTo
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (oldData) => oldData,
    enabled: !!dateFrom && !!dateTo,
  });
};

export default useFetchRecordHistory;
