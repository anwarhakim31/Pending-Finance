import Authlayout from "@/components/layouts/AuthLayout";
import ForgetPasswordView from "@/components/views/auth/ForgetPasswordView";
import React from "react";

const ForgetPage = () => {
  return (
    <Authlayout>
      <ForgetPasswordView />
    </Authlayout>
  );
};

export default ForgetPage;
