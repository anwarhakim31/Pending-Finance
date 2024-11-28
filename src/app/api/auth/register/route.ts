import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullname, password, store } = body;

    const isExist = await prisma.user.findFirst({
      where: {
        fullname: fullname,
      },
    });

    if (isExist) {
      return ResponseError("Nama Lengkap sudah digunakan", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        fullname: fullname,
        password: hashedPassword,
        store: store,
      },
    });

    return NextResponse.json({ status: 200, success: true, data: user });
  } catch (error) {
    console.error(error);
    return ResponseError("Internal Server Error", 500);
  }
}
