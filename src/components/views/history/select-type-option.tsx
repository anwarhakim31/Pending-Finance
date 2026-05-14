"use client";

import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SelectTypeOption = ({
  data,
  isLoading,
}: {
  data: { id: string; value: string }[];
  isLoading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const [selectedValue, setSelectedValue] = useState<string | null>(
    searchParams.get("type") || null,
  );
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (itemValue: string) => {
    if (itemValue === "semua") {
      router.replace(pathname);
    } else {
      router.replace(`${pathname}?type=${itemValue}`);
    }

    setSelectedValue(itemValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            " justify-between text-xs w-32 focus-visible:ring-primary hover:bg-white",
            !selectedValue && "text-muted-foreground",
          )}
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
        >
          {selectedValue
            ? data.find((item) => item.id === selectedValue)?.value
            : "Pilih jenis"}
          <ChevronDown className={`${isOpen ? "rotate-180" : ""} opacity-50`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" max-h-[200px] w-[--radix-popover-trigger-width]   p-0">
        <Command>
          <CommandEmpty className="text-xs mt-2 text-center">
            Barang tidak ditemukan.
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  className="text-xs"
                  value={item.value}
                  key={item?.id}
                  onSelect={() => {
                    handleSelect(item.id);
                  }}
                >
                  {item.value}
                  <Check className={cn("ml-auto")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectTypeOption;
