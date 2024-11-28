import Authlayout from "@/components/layouts/AuthLayout";
import { RegisterView } from "@/components/views/auth/RegisterView";
import React from "react";

const RegisterPage = () => {
  return (
    <Authlayout>
      <RegisterView />
    </Authlayout>
  );
};

export default RegisterPage;
