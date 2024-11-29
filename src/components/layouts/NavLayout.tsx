"use client";
import { BoxIcon, History, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const NavLayout = () => {
  const pathname = usePathname();

  const list = [
    {
      title: "Dashboard",
      path: "/dashboard",
      logo: (
        <LayoutDashboard
          size={28}
          strokeWidth={1}
          className={`text-gray-700 ${
            pathname === "/dashboard" ? "fill-violet-700 text-violet-400" : ""
          }`}
        />
      ),
    },
    {
      title: "Barang",
      path: "/products",
      logo: (
        <BoxIcon
          size={28}
          strokeWidth={1}
          className={`text-gray-700 ${
            pathname === "/products" ? "fill-violet-700 text-violet-400" : ""
          }`}
        />
      ),
    },
    {
      title: "Riwayat",
      path: "/history",
      logo: (
        <History
          size={28}
          strokeWidth={1}
          className={`text-gray-700 ${
            pathname === "/history" ? "fill-violet-700 text-violet-400" : ""
          }`}
        />
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full  bg-white border overflow-hidden border-gray-200 sm:w-20 sm:top-0 ">
      <nav className="container flex justify-center items-center sm:flex-col sm:mt-16">
        {list.map((item) => (
          <Link
            key={item.title}
            href={item.path}
            className={`z-10 flex flex-col justify-center items-center w-full max-w-28 h-16 hover:bg-violet-100 ${
              pathname === item.path ? "text-violet-700 fill-violet-700" : ""
            }`}
          >
            {item.logo}
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavLayout;
