import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { fullname, store, newPassword } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        fullname: fullname,
        store: store,
      },
    });

    if (!user) {
      return ResponseError("Akun tidak terdaftar", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ status: 200, success: true, data: user });
  } catch (error) {
    console.error(error);
    return ResponseError("Internal Server Error", 500);
  }
}
