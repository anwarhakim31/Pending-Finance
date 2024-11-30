import { CalendarCustom } from "@/components/ui/CustomCalender";
import useFetchDateGroup from "@/hooks/record/useFetchDateGroup";
import { useRouter } from "next/navigation";
import React from "react";

const DateRecordView = () => {
  const router = useRouter();
  const [month, setMonth] = React.useState(new Date());

  const { data } = useFetchDateGroup(month);

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
