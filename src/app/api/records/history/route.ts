import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { convertBigIntToJSON } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const records = await prisma.records.findMany({
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
