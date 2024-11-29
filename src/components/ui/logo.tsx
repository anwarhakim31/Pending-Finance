import { CoinsIcon } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center  gap-2">
      <CoinsIcon strokeWidth={1.5} className="text-violet-700" />
      <h1 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-900 italic">
        Pending
      </h1>
    </div>
  );
};

export default Logo;
