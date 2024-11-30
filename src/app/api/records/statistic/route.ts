import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await verifyToken(req);

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
        (totalIncome?._sum?.total || 0) - (totalReceive?._sum?.total || 0);

      return NextResponse.json({
        status: 200,
        success: true,
        data: {
          totalIncome: totalIncome._sum.total,
          totalReceive: totalReceive._sum.total,
          totalPending: totalPending,
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
