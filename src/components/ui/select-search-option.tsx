"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { useState } from "react";

const SelectSearchOption = ({
  field,
  data,
  isLoading,
}: {
  field: FieldValues;
  data: { id: string; value: string }[];
  isLoading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (itemValue: string) => {
    field.onChange(itemValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between text-xs",
              !field.value && "text-muted-foreground"
            )}
            onClick={() => setIsOpen(true)}
            disabled={isLoading}
          >
            {field.value
              ? data?.find((item) => item.value === field.value)?.value
              : "Pilih Barang"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] max-h-[200px]  p-0">
        <Command>
          <CommandInput
            placeholder="Cari Nama Barang..."
            className="h-9 text-xs"
          />
          <CommandList>
            <CommandEmpty className="text-xs mt-2 text-center">
              Barang tidak ditemukan.
            </CommandEmpty>
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  className="text-xs"
                  value={item.value}
                  key={item?.id}
                  onSelect={() => {
                    handleSelect(item.value);
                  }}
                >
                  {item.value}
                  <Check
                    className={cn(
                      "ml-auto",
                      item.value === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectSearchOption;
