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
          size={24}
          strokeWidth={1}
          className={`text-gray-700 dark:text-gray-200  ${
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
          size={24}
          strokeWidth={1}
          className={`text-gray-700 dark:text-gray-200  ${
            pathname === "/products" ? "fill-violet-700 text-white" : ""
          }`}
        />
      ),
    },
    {
      title: "Riwayat",
      path: "/history",
      logo: (
        <History
          size={24}
          strokeWidth={1}
          className={`text-gray-700 dark:text-gray-200  ${
            pathname === "/history" ? "fill-violet-700 text-white" : ""
          }`}
        />
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full  bg-white dark:bg-black  border  overflow-hidden border-gray-0 md:w-20 md:top-0 ">
      <nav className="container  flex justify-center items-center md:flex-col md:mt-16">
        {list.map((item) => (
          <Link
            key={item.title}
            href={item.path}
            className={`relative z-10 flex flex-col justify-center items-center w-full max-w-28 h-14 hover:bg-violet-100 dark:hover:bg-gray-700 ${
              pathname === item.path ? "text-violet-700 fill-violet-700" : ""
            }`}
          >
            {item.logo}
            <span className="text-xs mt-1">{item.title}</span>
            {pathname === item.path && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1   bg-violet-600"></div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavLayout;
