import connectDB from "@/lib/db";
import GroupRecord from "@/lib/models/groupRecord-model";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    const { searchParams } = req.nextUrl;
    const month = searchParams.get("month") || new Date().toISOString();

    const currentDate = new Date(month);

    const firstDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const lastDayOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      0
    );

    if (token && typeof token === "object" && "id" in token) {
      const dateGroup = await GroupRecord.find({
        userId: token.id as string,
        date: {
          $gte: firstDayOfPreviousMonth,
          $lte: lastDayOfNextMonth,
        },
        "records.0": { $exists: true },
      })
        .populate({
          path: "records",
        })
        .exec();

      const uniqueDates = new Map<string, { date: Date; id: string }>();
      dateGroup.forEach((record) => {
        const dateOnly = record.date.toISOString().split("T")[0];
        if (!uniqueDates.has(dateOnly)) {
          uniqueDates.set(dateOnly, record);
        }
      });

      const result = Array.from(uniqueDates.values()).map((record) => {
        const dateOnly = record.date.toISOString().split("T")[0];
        return {
          id: record.id,
          date: `${dateOnly}T00:00:00.000Z`,
        };
      });

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil mendapatakan data.",
        data: result,
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
