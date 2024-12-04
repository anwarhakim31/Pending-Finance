"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { id } from "date-fns/locale";
import { useState } from "react";

export function DatePicker({ field }: { field: FieldValues }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal text-xs",
              !field.value && "text-muted-foreground "
            )}
          >
            {field.value ? (
              format(field.value, "PPP", { locale: id })
            ) : (
              <span>Pilih tanggal</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          defaultMonth={field.value}
          onSelect={(date) => {
            field.onChange(date);
            setIsOpen(false);
          }}
          className="text-xs"
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
