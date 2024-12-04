import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { fullname, photo, phone, store } = await req.json();

      const data = await prisma.user.update({
        where: {
          id: token.id,
        },
        data: {
          fullname: fullname,
          photo: photo,
          phone: phone,
          store: store,
        },
      });
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil mengubah data profile.",
        data,
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
