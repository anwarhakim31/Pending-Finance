import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { convertBigIntToJSON } from "@/utils/helpers";

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
        (total, record) => total + (record.total || BigInt(0)),
        BigInt(0)
      );
      const totalProduct = record?.records.length;

      if (!record) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      const income = convertBigIntToJSON({
        totalIncome: totalIncome || BigInt(0),
      });

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil mendapatakan data.",
        data: {
          ...income,
          totalProduct,
          record: record.records.map((record) => ({
            id: record.id,
            product: record.product,
            quantity: record.quantity,
            total: convertBigIntToJSON({ total: record.total || BigInt(0) })
              .total,
            date: record.date,
          })),
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
    const { quantity, product: productName } = await req.json();

    if (token && typeof token === "object" && "id" in token) {
      const productDB = await prisma.products.findFirst({
        where: {
          name: productName,
          userId: token.id,
        },
      });

      if (!productDB) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      let total = 0;

      if (productDB.discountQuantity && productDB.discountPrice) {
        const qtyDiscount = Math.floor(quantity / productDB.discountQuantity);

        const qtyNotDiscount =
          quantity - qtyDiscount * productDB.discountQuantity;

        total =
          qtyNotDiscount * productDB.price +
          qtyDiscount * productDB.discountPrice;
      } else {
        total = productDB.price * parseInt(quantity);
      }

      await prisma.records.update({
        where: {
          id: recordId,
        },
        data: {
          quantity: parseInt(quantity),
          total: total,
        },
      });

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil merubah data catatan.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } }
) {
  const token = await verifyToken(req);
  try {
    const recordId = params.params.id;

    if (token instanceof NextResponse) {
      return token;
    }
    const existingRecord = await prisma.records.findUnique({
      where: {
        id: recordId,
      },
    });

    if (!existingRecord) {
      return ResponseError("Catatan tidak ditemukan.", 404);
    }

    await prisma.records.delete({
      where: { id: recordId },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Berhasil menghapus data dari catatan.",
    });
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
