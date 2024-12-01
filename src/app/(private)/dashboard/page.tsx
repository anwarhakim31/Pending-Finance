"use client";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import NavLayout from "@/components/layouts/NavLayout";
import MainDashboardView from "@/components/views/dashboard/MainDashboardView";

const DashboardPage = () => {
  return (
    <>
      <HeaderLayout />
      <MainDashboardView />
      <NavLayout />
    </>
  );
};

export default DashboardPage;
