import connectDB from "@/lib/db";
import Record from "@/lib/models/record-model";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const { date, total } = await req.json();
      const localDate = new Date(date);
      localDate.setHours(23, 59, 59, 999);
      const utcDate = new Date(localDate.toISOString());

      const record = await Record.create({
        userId: token.id,
        type: "receive",
        date: utcDate,
        total: total,
      });

      if (!record) {
        return ResponseError("Gagal menambahkan catatan.", 400);
      }

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil menambahkan catatan.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
