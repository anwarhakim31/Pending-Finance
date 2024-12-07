import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Record from "@/lib/models/record-model";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import GroupRecord from "@/lib/models/groupRecord-model";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);

  const today = new Date().setHours(23, 59, 59, 999);
  const utcDate = new Date(today);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const userId = new mongoose.Types.ObjectId(token.id as string);

      const [totals] = await Record.aggregate([
        { $match: { userId } },
        {
          $facet: {
            income: [
              { $match: { type: "income" } },
              { $group: { _id: null, total: { $sum: "$total" } } },
            ],
            receive: [
              { $match: { type: "receive" } },
              { $group: { _id: null, total: { $sum: "$total" } } },
            ],
          },
        },
      ]);

      const totalIncome = totals.income[0]?.total || 0;
      const totalReceive = totals.receive[0]?.total || 0;
      const totalPending = totalIncome - totalReceive;

      const fiveGroupRecord = await GroupRecord.find({
        userId,
        date: { $lte: utcDate },
      })
        .populate({
          path: "records",
          select: "date type total",
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const chartStatistic = fiveGroupRecord
        .flatMap((item) => item.records)
        .reduce((acc, record) => {
          const date = record.date.toISOString().split("T")[0];
          acc[date] = acc[date] || { date, income: 0, receive: 0 };
          if (record.type === "income")
            acc[date].income += Number(record.total) || 0;
          if (record.type === "receive")
            acc[date].receive += Number(record.total) || 0;
          return acc;
        }, {});

      const formattedChartStatistic = Object.values(chartStatistic)
        .map((item) => ({
          date: (item as { date: string; income: number; receive: number })
            .date,
          ditambah: (item as { date: string; income: number; receive: number })
            .income,
          diterima: (item as { date: string; income: number; receive: number })
            .receive,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      return NextResponse.json({
        status: 200,
        success: true,
        data: {
          totalIncome,
          totalReceive,
          totalPending,
          chartStatistic: formattedChartStatistic,
        },
        message: "Berhasil mendapatakan data.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.error(error);
    return ResponseError("Internal Server Error", 500);
  }
}
