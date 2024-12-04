import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { fullname, photo, phone, store } = await req.json();

      const isExist = await prisma.user.findFirst({
        where: {
          fullname: fullname,
          id: { not: token.id },
        },
      });

      if (isExist) {
        return ResponseError("Nama Lengkap sudah digunakan", 400);
      }

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
        message: "Berhasil mengganti data profile.",
        data,
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { oldPassword, newPassword } = await req.json();

      console.log(oldPassword, newPassword);

      const user = await prisma.user.findFirst({
        where: {
          id: token.id,
        },
      });

      if (!user) {
        return ResponseError("User tidak ditemukan", 400);
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return ResponseError("Password lama salah.", 400);
      }

      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, genSalt);

      await prisma.user.update({
        where: {
          id: token.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil mengganti password.",
      });
    }

    return ResponseError("Unauthorized", 401);
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
