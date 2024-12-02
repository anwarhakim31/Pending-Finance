"use client";
import React from "react";
import Logo from "../ui/logo";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "../ui/theme-switcher";

const HeaderLayout = () => {
  return (
    <header
      className={`absolute z-[10] top-0 left-0 w-full   dark:bg-black py-2 `}
      data-theme="light"
    >
      <div className="container flex justify-between items-center px-3">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link
            href="/profile"
            className=" rounded-full focus-within:outline-violet-700 focus-within:outline-2 "
          >
            <Avatar className="w-8 h-8 bg-gray-200 dark:bg-black ">
              <Image
                src={"/user.png"}
                alt="user"
                width={40}
                height={40}
                priority
              />
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
