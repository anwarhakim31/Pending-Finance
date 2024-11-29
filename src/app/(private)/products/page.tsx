import HeaderLayout from "@/components/layouts/HeaderLayout";
import NavLayout from "@/components/layouts/NavLayout";
import ProductMainView from "@/components/views/Products/ProductMainView";
import React from "react";

const ProductPage = () => {
  return (
    <>
      <HeaderLayout />
      <ProductMainView />
      <NavLayout />
    </>
  );
};

export default ProductPage;
