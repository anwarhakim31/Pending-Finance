import { Products } from "@/types/model";
import React from "react";
import { formatCurrency } from "../../utils/helpers";
import { ModalEditProduct } from "./ModalEditProduct";
import { ModalOneDelete } from "../../fragments/ModalOneDelete";

const ProductCardList = ({ product }: { product: Products }) => {
  return (
    <div
      key={product.id}
      className=" border border-gray-300 rounded-lg p-2 dark:border-gray-600"
    >
      <div className="relative">
        <h3 className="text-base font-medium text-gray-800 dark:text-white">
          {product.name}
        </h3>

        <p className="text-xs  text-gray-600 mt-1 dark:text-white ">
          <span className="font-medium text-gray-600 dark:text-white ">
            Harga
          </span>
          : {formatCurrency(product.price)}
        </p>
        <p className="text-xs text-gray-600 mt-1 dark:text-white">
          <span className="font-medium text-gray-600 dark:text-white ">
            Diskon
          </span>
          :{" "}
          {product.discountPrice
            ? product.discountPrice + " - " + product.discountQuantity + " Pcs"
            : "-"}
        </p>
        <div className="absolute top-0 right-1 flex gap-2">
          <ModalEditProduct data={product} />
          <ModalOneDelete
            id={product?.id?.toString() || ""}
            url="/product"
            keys="products"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
