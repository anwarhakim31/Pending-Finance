import instance from "@/lib/instance";

import { useQuery } from "@tanstack/react-query";

const useFetchGroupData = (id: string) => {
  return useQuery({
    queryKey: ["groupData"],
    queryFn: async () => {
      const res = await instance.get("/records/" + id);

      if (res.status === 200) {
        return res.data;
      }
    },
  });
};

export default useFetchGroupData;
