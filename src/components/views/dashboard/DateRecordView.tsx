import { CalendarCustom } from "@/components/ui/CustomCalender";
import { useRouter } from "next/navigation";
import React from "react";

const DateRecordView = ({
  data,
  setMonth,
}: {
  data: { data: { id: string; date: Date }[] };
  setMonth: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const router = useRouter();

  return (
    <CalendarCustom
      mode="single"
      onMonthChange={(month) => setMonth(month)}
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
