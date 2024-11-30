import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  params: { params: { id: string } }
) {
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const recordId = params.params.id;

      const record = await prisma.groupRecord.findFirst({
        where: {
          id: recordId,
        },
        include: {
          records: true,
        },
      });

      const totalIncome = record?.records.reduce(
        (total, record) => total + record.total,
        0
      );

      const totalProduct = record?.records.length;

      if (!record) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil mendapatakan data.",
        data: {
          totalIncome,
          totalProduct,
          record: record.records,
          date: record.date,
        },
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  params: { params: { id: string } }
) {
  const token = await verifyToken(req);
  try {
    const recordId = params.params.id;
    const { quantity } = await req.json();

    if (token instanceof NextResponse) {
      return token;
    }

    await prisma.records.update({
      where: {
        id: recordId,
      },
      data: {
        quantity: parseInt(quantity),
      },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Berhasil merubah data catatan.",
    });
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
