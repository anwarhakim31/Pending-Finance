"use client";
import InputSearch from "@/components/ui/InputSearch";
import { motion as m } from "framer-motion";

import React, { useEffect, useState } from "react";
import { ModalAddProduct } from "./ModalAddProduct";
import useFetchProduct from "@/hooks/product/useFetchProduct";
import { Products } from "@/types/model";
import ProductCardList from "@/components/views/Products/ProductCardList";
import { FileQuestion } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/ui/Loader";

const circlePath = {
  x: [0, 200, 0, 100, 0, 200, 0, 300, 0],
  y: [0, 0, -100, -50, 0, 50, 250, 200, 0],
};

const ProductMainView = () => {
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 10,
    total: 0,
    totalPage: 0,
  });
  const { data, isPending } = useFetchProduct(searchParams);
  useEffect(() => {
    setPagination(data?.pagination);
  }, [data?.pagination]);

  console.log(pagination);

  return (
    <main>
      <section className="container pt-[4.5rem] pb-12 px-4 sm:pb-0">
        <div className="relative overflow-hidden w-full h-24 bg-gradient-to-tr rounded-lg flex-center flex-col from-purple-700 p-4  via-violet-500 to-violet-400">
          <h3 className="relative z-[1] text-white text-4xl">
            {data?.pagination?.total || 0}
          </h3>
          <h1 className="relative z-[1] text-white text-xs font-normal mt-2">
            Total Barang
          </h1>

          <m.div
            animate={circlePath}
            transition={{
              duration: 10,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute z-0 top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-orange-400 rounded-full  blur-3xl "
          ></m.div>
        </div>
        <div className="flex items-center mt-10 gap-4 ">
          <InputSearch disabled={isPending} />
          <ModalAddProduct isLoading={isPending} />
        </div>
        <div className="mt-4 space-y-4">
          {isPending ? (
            <Loader />
          ) : data?.data.length > 0 ? (
            data.data.map((product: Products) => (
              <ProductCardList key={product.id} product={product} />
            ))
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
