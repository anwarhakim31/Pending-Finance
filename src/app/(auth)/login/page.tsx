"use client";
import Authlayout from "@/components/layouts/AuthLayout";
import LoginView from "@/components/views/auth/LoginView";
import React from "react";

const LoginPage = () => {
  return (
    <Authlayout>
      <LoginView />
    </Authlayout>
  );
};

export default LoginPage;
