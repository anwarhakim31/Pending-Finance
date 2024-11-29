import React from "react";
import Logo from "../ui/logo";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";

const HeaderLayout = () => {
  return (
    <header className=" fixed top-0 left-0 w-full py-2 px-4  bg-white border-b border-gray-0">
      <div className="container flex justify-between items-center">
        <Logo />
        <Link href="/profile">
          <Avatar className="w-8 h-8 bg-gray-300">
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
    </header>
  );
};

export default HeaderLayout;
