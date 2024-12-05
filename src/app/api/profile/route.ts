import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/lib/models/user-model";
import connectDB from "@/lib/db";

export async function PUT(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { fullname, photo, phone, store } = await req.json();

      const isExist = await User.findOne({
        fullname: fullname,
        _id: { $ne: token.id },
      });

      if (isExist) {
        return ResponseError("Nama Lengkap sudah digunakan", 400);
      }

      const data = await User.findOneAndUpdate(
        { _id: token.id },
        {
          fullname,
          photo,
          phone,
          store,
        },
        { new: true }
      );

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
  await connectDB();
  const token = await verifyToken(req);

  try {
    if (token && typeof token === "object" && "id" in token) {
      const { oldPassword, newPassword } = await req.json();

      const user = await User.findOne({ _id: token.id });

      if (!user) {
        return ResponseError("User tidak ditemukan", 400);
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return ResponseError("Password lama salah.", 400);
      }

      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, genSalt);

      await User.findOneAndUpdate(
        { _id: token.id },
        {
          password: hashedPassword,
        },
        { new: true }
      );
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
