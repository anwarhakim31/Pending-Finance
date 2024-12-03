"use client";
import InputSearch from "@/components/ui/InputSearch";

import React, { useEffect, useState } from "react";
import { ModalAddProduct } from "./ModalAddProduct";
import useFetchProduct from "@/hooks/product/useFetchProduct";
import { Products } from "@/types/model";
import ProductCardList from "@/components/views/Products/ProductCardList";
import { FileQuestion } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/ui/Loader";
import BubbleComponent from "@/components/ui/bubble";
import AnimateCounter from "@/components/ui/animate-counter";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

const ProductMainView = () => {
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState({
    page: searchParams.get("page") || 3,
    limit: searchParams.get("limit") || 20,
    total: 0,
  });
  const { data, isPending } = useFetchProduct(searchParams);
  useEffect(() => {
    setPagination(data?.pagination);
  }, [data?.pagination]);

  return (
    <main>
      <section className="container pt-[4.5rem] pb-12 px-4 ">
        <div className="relative overflow-hidden w-full h-24 bg-gradient-to-tr rounded-lg flex-center flex-col from-purple-700 p-4  via-violet-500 to-violet-400">
          <h3 className="relative z-[1] text-white text-4xl">
            <AnimateCounter value={data?.pagination.total || 0} type="number" />
          </h3>
          <h1 className="relative z-[1] text-white text-xs font-medium mt-2">
            Total Barang
          </h1>
          <BubbleComponent />
        </div>
        <div className="flex items-center mt-10 gap-4 ">
          <InputSearch disabled={isPending} />
          <ModalAddProduct isLoading={isPending} />
        </div>
        <div className="mt-4 space-y-4">
          {isPending ? (
            <Loader />
          ) : data?.data.length > 0 ? (
            <>
              {data.data.map((product: Products) => (
                <ProductCardList key={product.id} product={product} />
              ))}
              {pagination?.page === 1 &&
              data.data.length < pagination?.limit ? null : (
                <PaginationWithLinks
                  page={data?.pagination?.page}
                  pageSize={data?.pagination?.limit}
                  totalCount={data?.pagination?.total}
                  keys="recordHistory"
                />
              )}
            </>
          ) : (
            <div className="w-full flex justify-center items-center flex-col mt-20">
              <FileQuestion size={50} strokeWidth={1} />
              <p className="text-xs text-muted-foreground mt-2">
                Data Tidak Ditemukan.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductMainView;
