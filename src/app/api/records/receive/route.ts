import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = await verifyToken(req);

    if (token && typeof token === "object" && "id" in token) {
      const { date, total } = await req.json();

      await prisma.records.create({
        data: {
          userId: token.id as string,
          type: "receive",
          date: date,
          total: parseInt(total),
        },
      });

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
