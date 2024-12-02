import HeaderLayout from "@/components/layouts/HeaderLayout";
import NavLayout from "@/components/layouts/NavLayout";
import MainHistoryView from "@/components/views/history/MainHistoryView";
import React from "react";

const HistoryPage = () => {
  return (
    <>
      <HeaderLayout />
      <MainHistoryView />
      <NavLayout />
    </>
  );
};

export default HistoryPage;
