import { formatToday } from "@/utils/helpers";
import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { date, quantity, product } = await req.json();

      const localDate = new Date(date);
      localDate.setHours(23, 59, 59, 999);

      const productDB = await prisma.products.findFirst({
        where: {
          name: product,
        },
      });

      if (!productDB) {
        return ResponseError("Produk tidak ditemukan", 400);
      }

      const totalPrice = productDB.price * parseInt(quantity);
      const totalPriceDiscount =
        productDB.discountQuantity && productDB.discountPrice
          ? (parseInt(quantity) % productDB.discountQuantity) *
            productDB.discountPrice
          : 0;
      const total = productDB.discountPrice
        ? totalPrice - totalPriceDiscount
        : totalPrice;

      let groupRecord = await prisma.groupRecord.findFirst({
        where: {
          date: {
            gte: formatToday(localDate)[0],
            lt: formatToday(localDate)[1],
          },
          userId: token.id as string,
        },
        include: {
          records: true,
        },
      });

      if (!groupRecord) {
        groupRecord = await prisma.groupRecord.create({
          data: {
            date: localDate,
            userId: token.id as string,
          },
          include: {
            records: true,
          },
        });
      }

      console.log(formatToday(localDate));

      const existingRecordToday = await prisma.records.findFirst({
        where: {
          date: {
            gte: formatToday(localDate)[0],
            lt: formatToday(localDate)[1],
          },
          userId: token.id as string,
          product: product,
        },
        select: {
          id: true,
          quantity: true,
          total: true,
        },
      });

      if (existingRecordToday) {
        await prisma.records.update({
          where: {
            id: existingRecordToday.id,
          },
          data: {
            quantity: (existingRecordToday?.quantity || 0) + parseInt(quantity),
            total: Number(existingRecordToday.total) + total,
          },
        });
      } else {
        await prisma.records.create({
          data: {
            userId: token.id as string,
            type: "income",
            date: localDate,
            product: product,
            total,
            quantity: parseInt(quantity),
            groupId: groupRecord.id,
          },
        });
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
