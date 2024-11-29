import React from "react";
import Logo from "../ui/logo";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "../ui/theme-switcher";

const HeaderLayout = () => {
  return (
    <header
      className=" fixed top-0 left-0 w-full py-2 px-4  bg-white dark:bg-black border-b border-gray-0"
      data-theme="light"
    >
      <div className="container flex justify-between items-center">
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
