import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchProduct = (searchParams?: URLSearchParams) => {
  const search = searchParams?.get("search") || "";

  return useQuery({
    queryKey: ["products", { search }],
    queryFn: async () => {
      const res = await instance.get("/product" + `?search=${search}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (oldData) => oldData,
  });
};

export default useFetchProduct;
