import { CalendarCustom } from "@/components/ui/CustomCalender";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const DateRecordView = ({
  data,
  setMonth,
}: {
  data: { data: { id: string; date: Date }[] };
  setMonth: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const month = params.get("month");

  return (
    <CalendarCustom
      mode="single"
      defaultMonth={month ? new Date(month) : new Date()}
      onMonthChange={(month) => {
        setMonth(month);
        router.replace("/dashboard?month=" + month.toISOString(), {
          scroll: false,
        });
      }}
      onSelect={(date) =>
        router.push(
          `/record/${
            data?.data?.find(
              (d: { date: Date }) =>
                new Date(d.date).toDateString() === date?.toDateString()
            )?.id
          }`
        )
      }
      disabled={(date) =>
        !data?.data?.some(
          (d: { date: Date }) =>
            new Date(d.date).toDateString() === date.toDateString()
        )
      }
    />
  );
};

export default DateRecordView;
