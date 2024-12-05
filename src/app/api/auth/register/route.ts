// import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { fullname, password, store } = body;

    // const isExist = await prisma.user.findFirst({
    //   where: {
    //     fullname: fullname,
    //   },
    // });

    const isExist = await User.findOne({ fullname: fullname });

    if (isExist) {
      return ResponseError("Nama Lengkap sudah digunakan", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // await prisma.user.create({
    //   data: {
    //     fullname: fullname,
    //     password: hashedPassword,
    //     store: store,
    //   },
    // });

    await User.create({
      fullname: fullname,
      password: hashedPassword,
      store: store,
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Berhasil membuat akun",
    });
  } catch (error) {
    console.error(error);
    return ResponseError("Internal Server Error", 500);
  }
}
