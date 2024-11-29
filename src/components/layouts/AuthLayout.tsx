"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "../ui/logo";

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center ">
      <Logo />
      <div className="w-full max-w-[400px] mt-4 bg-white lg:shadow-[0_0.2rem_0.3rem_rgba(0,0,0,0.2)] p-8 rounded-md">
        <h3 className="text-md font-medium ">Selamat Datang</h3>
        <small className="text-xs text-muted-foreground mb-4 block">
          {pathname === "/login"
            ? "Masukan data yang sudah terdaftar"
            : pathname === "/register"
            ? "Masukan data untuk daftar"
            : "Masukkan data untuk ganti password"}
        </small>

        {children}
        <p className="text-center text-xs font-normal text-gray-600 mt-2 ">
          {pathname === "/login"
            ? "Belum punya akun?"
            : pathname === "/register"
            ? "Sudah punya akun?"
            : "Ingat Password?"}
          <Link
            href={pathname === "/login" ? "/register" : "/login"}
            className="text-violet-700 ml-2 hover:underline"
          >
            {pathname === "/login" ? "Daftar" : "Masuk"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Authlayout;
