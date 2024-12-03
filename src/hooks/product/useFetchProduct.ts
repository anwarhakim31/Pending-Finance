import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const useFetchProduct = (searchParams?: URLSearchParams) => {
  const search = searchParams?.get("search") || "";
  const page = searchParams?.get("page") || 1;
  const limit = searchParams?.get("limit") || 20;

  return useQuery({
    queryKey: ["products", { search, page, limit }],
    queryFn: async () => {
      const res = await instance.get(
        "/product" + `?search=${search}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (oldData) => oldData,
  });
};

export default useFetchProduct;
