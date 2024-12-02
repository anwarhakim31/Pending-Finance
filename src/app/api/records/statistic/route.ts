import { convertBigIntToJSON, formatToday } from "@/utils/helpers";
import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const totalIncome = await prisma.records.aggregate({
        _sum: {
          total: true,
        },
        where: {
          type: "income",
          userId: token.id as string,
        },
      });
      const totalReceive = await prisma.records.aggregate({
        _sum: {
          total: true,
        },
        where: {
          type: "receive",
          userId: token.id as string,
        },
      });

      const totalPending =
        (totalIncome?._sum?.total || BigInt(0)) -
        (totalReceive?._sum?.total || BigInt(0));

      // <--- STATISTIC RECORDS --->

      const records = await prisma.records.findMany({
        where: {
          userId: token.id as string,
          date: {
            lt: formatToday(new Date())[1],
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 1000,
      });
      const uniqueDates = new Map<string, { date: Date; total: number }>();

      records.forEach((record) => {
        const dateOnly = record.date.toISOString().split("T")[0];

        if (!uniqueDates.has(dateOnly)) {
          uniqueDates.set(dateOnly, {
            date: record.date,
            total: Number(record.total),
          });
        }
      });

      const filteredDate = Array.from(uniqueDates.values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((record) => record.date);

      const formattedDates = filteredDate.map(
        (date) => date.toISOString().split("T")[0]
      );

      const groupedRecords = await prisma.records.groupBy({
        by: ["type", "date"],
        where: {
          userId: token.id as string,
          OR: formattedDates.map((date) => ({
            date: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lte: new Date(`${date}T23:59:59.999Z`),
            },
          })),
        },
        _sum: {
          total: true,
        },
      });

      const chartStatistic = groupedRecords?.reduce(
        (
          acc: {
            [key: string]: { date: string; income: number; receive: number };
          },
          record
        ) => {
          const date = record.date.toISOString().split("T")[0];

          if (!acc[date]) {
            acc[date] = {
              date: record.date.toISOString().split("T")[0],
              income: 0,
              receive: 0,
            };
          }

          if (record.type === "income") {
            acc[date].income += Number(record._sum.total) || 0;
          } else if (record.type === "receive") {
            acc[date].receive += Number(record._sum.total) || 0;
          }

          return acc;
        },
        {}
      );

      const formattedChartStatistic = Object.values(chartStatistic)
        .map((item) => ({
          date: item.date,
          ditambah: item.income,
          diterima: item.receive,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      const responseData = convertBigIntToJSON({
        totalIncome: totalIncome._sum.total || BigInt(0),
        totalReceive: totalReceive._sum.total || BigInt(0),
        totalPending,
      });

      return NextResponse.json({
        status: 200,
        success: true,
        data: {
          ...responseData,
          chartStatistic: formattedChartStatistic,
        },
        message: "Berhasil mendapatakan data.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
