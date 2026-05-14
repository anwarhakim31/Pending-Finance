import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchRecordHistory = (dateFrom: Date, dateTo: Date, type?: string) => {
  const params = new URLSearchParams();
  params.append("from", dateFrom.toISOString());
  params.append("to", dateTo.toISOString());

  if (type) {
    params.append("type", type);
  }

  return useQuery({
    queryKey: ["history", { dateFrom, dateTo, type }],
    queryFn: async () => {
      const res = await instance.get("/records/history?" + params.toString());
      return res.data;
    },
    staleTime: 0,
    placeholderData: (oldData) => oldData,
    enabled: !!dateFrom && !!dateTo,
  });
};

export default useFetchRecordHistory;
