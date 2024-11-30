import { CoinsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const Logo = () => {
  const pathaneme = usePathname();

  return (
    <div className="flex items-center  gap-2">
      <CoinsIcon
        strokeWidth={1.5}
        className={
          pathaneme === "/dashboard" ? "text-white" : "text-violet-700"
        }
      />
      <h1
        className={`text-xl font-medium  ${
          pathaneme !== "/dashboard"
            ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-violet-500"
            : "text-white"
        } italic`}
      >
        Pending
      </h1>
    </div>
  );
};

export default Logo;
