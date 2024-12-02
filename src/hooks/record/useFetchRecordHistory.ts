import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchRecordHistory = () => {
  return useQuery({
    queryKey: ["recordHistory"],
    queryFn: async () => {
      const res = await instance.get("/records/history");
      return res.data;
    },
  });
};

export default useFetchRecordHistory;
