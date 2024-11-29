import React from "react";
import { Input } from "./input";
import { SearchIcon } from "lucide-react";

const InputSearch = () => {
  return (
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Cari Barang"
        className="rounded-full pl-8 w-full"
      />
      <SearchIcon
        className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground"
        size={16}
        strokeWidth={1.5}
      />
    </div>
  );
};

export default InputSearch;
