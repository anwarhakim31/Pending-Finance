import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { convertBigIntToJSON } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
      const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
      const fromDate = req.nextUrl.searchParams.get("from");
      const toDate = req.nextUrl.searchParams.get("to");

      const records = await prisma.records.findMany({
        where: {
          userId: token.id as string,
          date: {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const totalRecords = await prisma.records.count({
        where: {
          userId: token.id as string,
        },
      });

      if (!records) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      return NextResponse.json({
        status: 200,
        success: true,
        data: records?.map((record) => ({
          ...record,
          total: convertBigIntToJSON({ total: record.total || BigInt(0) })
            ?.total,
        })),
        pagination: {
          page,
          limit,
          total: totalRecords,
        },
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const recordId = req.nextUrl.searchParams.get("id");

      await prisma.records.delete({
        where: {
          userId: token.id as string,
          id: recordId as string,
        },
      });

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil menghapus catatan.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const { dataCheck } = await req.json();

      console.log(dataCheck);

      await prisma.records.deleteMany({
        where: {
          userId: token.id as string,
          id: {
            in: dataCheck.map((id: string) => id),
          },
        },
      });

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil menghapus catatan terpilih.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
