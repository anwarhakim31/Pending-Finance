"use client";
import InputSearch from "@/components/ui/InputSearch";
import { formatCurrency } from "@/components/utils/helpers";
import { motion as m } from "framer-motion";

import React from "react";
import { ModalAddProduct } from "./ModalAddProduct";
import { ModalEditProduct } from "./ModalEditProduct";
import { ModalOneDelete } from "@/components/fragments/ModalOneDelete";

const ProductMainView = () => {
  const circlePath = {
    x: [0, 200, 0, 100, 0, 200, 0, 300, 0],
    y: [0, 0, -100, -50, 0, 50, 250, 200, 0],
  };
  return (
    <main className="container pt-[4.5rem] pb-12 px-4 sm:pb-0">
      <div className="relative overflow-hidden w-full h-24 bg-gradient-to-tr rounded-lg flex-center flex-col from-purple-700 p-4  via-violet-500 to-violet-400">
        <h3 className="relative z-[1] text-white text-4xl">5</h3>
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
        <InputSearch />
        <ModalAddProduct />
      </div>
      <div className="mt-4 space-y-4">
        <div className=" border border-gray-300 rounded-lg p-2 dark:border-gray-600">
          <div className="relative">
            <h3 className="text-sm font-medium text-gray-700 dark:text-white">
              Nama Barang
            </h3>

            <p className="text-xs  text-gray-600 mt-1 dark:text-white ">
              <span className="font-medium text-gray-700 dark:text-white ">
                {" "}
                Harga
              </span>{" "}
              : {formatCurrency(10000)}
            </p>
            <p className="text-xs text-gray-600 mt-1 dark:text-white">
              <span className="font-medium text-gray-700 dark:text-white ">
                Diskon
              </span>{" "}
              : 3pcs = {formatCurrency(5000)}
            </p>
            <div className="absolute top-0 right-1 flex gap-2">
              <ModalEditProduct data={{ name: "Nama Barang", price: 10000 }} />
              <ModalOneDelete />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductMainView;
