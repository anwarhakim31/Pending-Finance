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

    if (token instanceof NextResponse) {
      return token;
    }

    const product = await prisma.products.findFirst({
      where: {
        name: productName,
      },
    });

    if (!product) {
      return ResponseError("Data tidak ditemukan", 400);
    }

    const totalPrice = product.price * parseInt(quantity);

    const totalPriceDiscount =
      Number(product.discountQuantity) && Number(product.discountPrice)
        ? (parseInt(quantity) % Number(product.discountQuantity)) *
          Number(product.discountPrice)
        : 0;

    const total = product.discountPrice
      ? totalPrice - totalPriceDiscount
      : totalPrice;

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
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    const recordId = req.nextUrl.searchParams.get("id");

    if (!recordId) {
      return ResponseError("ID catatan tidak ditemukan.", 400);
    }

    if (token instanceof NextResponse) {
      return token;
    }
    const existingRecord = await prisma.records.findUnique({
      where: { id: recordId },
    });

    if (!existingRecord) {
      return ResponseError("Record tidak ditemukan.", 404);
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
