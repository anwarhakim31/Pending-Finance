import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  //UNTUK MIDDLEWARE

  try {
    const userId = req.nextUrl.searchParams.get("userId") as string;
    const recordId = req.nextUrl.searchParams.get("recordId") as string;

    const records = await prisma.records.findFirst({
      where: {
        userId,
        groupId: recordId,
      },
    });
    if (!records) {
      return ResponseError("Data tidak ditemukan", 400);
    }

    return NextResponse.json({ status: 200, success: true, data: records });
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }

  //UNTUK MIDDLEWARE
}

export async function DELETE(req: NextRequest) {
  const token = await verifyToken(req);
  try {
    const groupId = req.nextUrl.searchParams.get("recordId") as string;

    if (token && typeof token === "object" && "id" in token) {
      const records = await prisma.groupRecord.delete({
        where: {
          id: groupId,
          userId: token.id as string,
        },
      });
      if (!records) {
        return ResponseError("Data tidak ditemukan", 400);
      }

      return NextResponse.json({ status: 200, success: true, data: records });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
