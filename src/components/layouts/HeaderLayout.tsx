"use client";
import React, { useEffect } from "react";
import Logo from "../ui/logo";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "../ui/theme-switcher";

const HeaderLayout = () => {
  const [scroll, setScroll] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0 ? true : false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed z-[1000] top-0 left-0 w-full   py-2  ${
        scroll ? "shadow-md bg-white dark:bg-black " : ""
      }`}
      data-theme="light"
    >
      <div className="container flex justify-between items-center px-3">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/profile">
            <Avatar className="w-8 h-8 bg-gray-200">
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
