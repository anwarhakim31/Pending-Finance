import { ResponseError } from "@/lib/ResponseError";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/lib/models/user-model";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { fullname, store, newPassword } = await req.json();

    const user = await User.findOne({ fullname, store });

    if (!user) {
      return ResponseError("Akun tidak terdaftar", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
      { new: true }
    );

    return NextResponse.json({ status: 200, success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    return ResponseError("Internal Server Error", 500);
  }
}
