import connectDB from "@/lib/db";
import GroupRecord from "@/lib/models/groupRecord-model";
import Product from "@/lib/models/product-model";
import Record from "@/lib/models/record-model";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { Record as RecordType } from "@/types/model";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  params: { params: { id: string } },
) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const groupid = params.params.id;

      const record = await GroupRecord.findById(groupid).populate("records");

      const first = new Date(record?.date.setHours(0, 0, 0, 0));
      const last = new Date(record?.date.setHours(23, 59, 59, 999));

      const list = await Record.find({
        userId: token.id as string,
        date: {
          $gte: new Date(first).toISOString(),
          $lte: new Date(last).toISOString(),
        },
        type: {
          $in: ["income", "receive"],
        },
      }).sort({ createdAt: -1 });

      const totals = list?.reduce(
        (total: { income: number; receive: number }, record: RecordType) => {
          if (record.type === "income") {
            total.income += record.total || 0;
          }

          if (record.type === "receive") {
            total.receive += record.total || 0;
          }

          return total;
        },
        { income: 0, receive: 0 },
      );

      if (!record) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil mendapatakan data.",
        data: {
          totalIncome: totals?.income || 0,
          totalReceive: totals?.receive || 0,

          record: list,
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
  params: { params: { id: string } },
) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    const recordId = params.params.id;
    const { quantity, product: productName, total } = await req.json();

    if (token && typeof token === "object" && "id" in token) {
      const record = await Record.findById(recordId);

      if (!record) {
        return ResponseError("Record tidak ditemukan", 400);
      }

      if (record.type === "receive") {
        await Record.findByIdAndUpdate(recordId, {
          total: parseInt(total),
        });
      } else {
        const productDB = await Product.findOne({
          name: productName,
          userId: token.id,
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

        await Record.findByIdAndUpdate(recordId, {
          quantity: parseInt(quantity),
          total: total,
        });
      }

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
  params: { params: { id: string } },
) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    const recordId = params.params.id;

    if (token instanceof NextResponse) {
      return token;
    }

    const existingRecord = await Record.findById(recordId);

    if (!existingRecord) {
      return ResponseError("Catatan tidak ditemukan.", 404);
    }

    const total = await Record.find({
      groupId: existingRecord.groupId,
    });

    if (total && total.length === 1) {
      await GroupRecord.findByIdAndDelete(existingRecord.groupId);
      await Record.findByIdAndDelete(recordId);
    } else {
      await Record.findByIdAndDelete(recordId);
    }

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
