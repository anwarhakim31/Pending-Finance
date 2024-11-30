import HeaderLayout from "@/components/layouts/HeaderLayout";
import NavLayout from "@/components/layouts/NavLayout";
import MainRecordView from "@/components/views/record/MainRecordView";
import React from "react";

const RecordPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <HeaderLayout />
      <MainRecordView id={params.id} />
      <NavLayout />
    </>
  );
};

export default RecordPage;
