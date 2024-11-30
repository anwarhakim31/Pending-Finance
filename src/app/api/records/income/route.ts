import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = await verifyToken(req);

    if (token && typeof token === "object" && "id" in token) {
      const { date, quantity, product } = await req.json();

      const productDB = await prisma.products.findFirst({
        where: {
          name: product,
        },
      });

      if (!productDB) {
        return ResponseError("Produk tidak ditemukan", 400);
      }

      const totalPrice = BigInt(productDB.price) * BigInt(parseInt(quantity));
      const totalPriceDiscount =
        productDB.discountQuantity && productDB.discountPrice
          ? BigInt(Number(parseInt(quantity) % productDB.discountQuantity)) *
            BigInt(productDB.discountPrice) *
            productDB.discountPrice
          : 0;
      const total = productDB.discountPrice
        ? totalPrice - BigInt(totalPriceDiscount)
        : totalPrice;

      const groupRecord = await prisma.groupRecord.create({
        data: {
          date: date,
          userId: token.id as string,
        },
      });

      await prisma.records.create({
        data: {
          userId: token.id as string,
          type: "income",
          date: date,
          product: product,
          total,
          quantity: parseInt(quantity),
          groupId: groupRecord.id,
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
