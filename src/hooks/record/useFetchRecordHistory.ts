import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchRecordHistory = (
  page: number,
  pageSize: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return useQuery({
    queryKey: ["recordHistory" + page + pageSize, dateFrom, dateTo],
    queryFn: async () => {
      const res = await instance.get(
        "/records/history?page=" +
          page +
          "&limit=" +
          pageSize +
          "&from=" +
          dateFrom +
          "&to=" +
          dateTo
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (oldData) => oldData,
  });
};

export default useFetchRecordHistory;
