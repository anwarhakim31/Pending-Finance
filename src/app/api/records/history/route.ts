import connectDB from "@/lib/db";
import GroupRecord from "@/lib/models/groupRecord-model";
import Record from "@/lib/models/record-model";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const fromDate = req.nextUrl.searchParams.get("from");
      const toDate = req.nextUrl.searchParams.get("to");
      const first = new Date(fromDate || new Date()).setHours(0, 0, 0, 0);
      const last = new Date(toDate || new Date()).setHours(23, 59, 59, 999);

      const records = await Record.find({
        userId: token.id as string,
        date: {
          $gte: fromDate ? new Date(first).toISOString() : undefined,
          $lte: toDate ? new Date(last).toISOString() : undefined,
        },
      }).sort({ createdAt: -1 });

      const totalRecords = await Record.countDocuments({
        userId: token.id as string,
      });

      if (!records) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      return NextResponse.json({
        status: 200,
        success: true,
        data: records,
        pagination: {
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
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const recordId = req.nextUrl.searchParams.get("id");

      const record = await Record.findByIdAndDelete({ _id: recordId });
      if (record.groupId) {
        await GroupRecord.findByIdAndDelete(
          { _id: record?.groupId },
          {
            $pull: {
              records: {
                _id: record?._id,
              },
            },
          }
        );
      }

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
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token && typeof token === "object" && "id" in token) {
      const { dataCheck } = await req.json();

      await Record.deleteMany({ _id: { $in: dataCheck } });
      await GroupRecord.updateMany(
        { records: { $in: dataCheck } },
        {
          $pull: {
            records: {
              $in: dataCheck,
            },
          },
        }
      );

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
