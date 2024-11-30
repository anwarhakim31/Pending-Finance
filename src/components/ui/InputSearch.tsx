import React, { useEffect, useState } from "react";
import { Input } from "./input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

const InputSearch = ({ ...props }: React.ComponentProps<"input">) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const pathname = usePathname();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const searchParams = new URLSearchParams();
      if (search) {
        searchParams.set("search", search);

        router.replace(`${pathname}?${searchParams.toString()}`);
      }

      if (search === "") {
        searchParams.delete("search");

        router.replace(`${pathname}?${searchParams.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timeOut);
  }, [search, pathname, router]);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type="search"
        disabled={props.disabled}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
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
