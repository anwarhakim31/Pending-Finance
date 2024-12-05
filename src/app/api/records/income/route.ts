import { formatToday } from "@/utils/helpers";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product-model";
import GroupRecord from "@/lib/models/groupRecord-model";
import Record from "@/lib/models/record-model";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { date, quantity, product } = await req.json();

      const localDate = new Date(date);
      localDate.setHours(23, 59, 59, 999);
      const utcDate = new Date(localDate.toUTCString());

      const productDB = await Product.findOne({
        userId: token.id as string,
        name: product,
      });

      if (!productDB) {
        return ResponseError("Produk tidak ditemukan", 400);
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

      let groupRecords = await GroupRecord.findOne({
        userId: token.id as string,
        date: {
          $gte: formatToday(localDate).startOfDayUTC,
          $lt: formatToday(localDate).endOfDayUTC,
        },
      });

      if (!groupRecords) {
        groupRecords = await GroupRecord.create({
          userId: token.id as string,
          date: utcDate,
          records: [],
        });
      }

      const existingRecordToday = await Record.findOne({
        userId: token.id as string,
        date: {
          $gte: formatToday(localDate).startOfDayUTC,
          $lt: formatToday(localDate).endOfDayUTC,
        },
        product: product,
      });

      if (existingRecordToday) {
        await Record.findOneAndUpdate(
          {
            _id: existingRecordToday._id,
          },
          {
            $inc: {
              quantity: parseInt(quantity),
              total: total,
            },
          }
        );

        await GroupRecord.findOneAndUpdate(
          {
            _id: groupRecords._id,
          },
          {
            $addToSet: {
              records: existingRecordToday._id,
            },
          }
        );
      } else {
        const newRecord = await Record.create({
          userId: token.id as string,
          type: "income",
          date: utcDate,
          product: product,
          total,
          quantity: parseInt(quantity),
          groupId: groupRecords._id,
        });

        await GroupRecord.findOneAndUpdate(
          {
            _id: groupRecords._id,
          },
          {
            $addToSet: {
              records: newRecord._id,
            },
          }
        );
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
