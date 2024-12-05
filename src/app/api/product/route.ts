// import { prisma } from "@/lib/prisma";
import connectDB from "@/lib/db";
import Product from "@/lib/models/product-model";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    const { name, price, discountPrice, discountQuantity } = await req.json();

    if (token && typeof token === "object" && "id" in token) {
      const nameIsExist = await Product.findOne({
        userId: token.id as string,
        name: name,
      });

      if (nameIsExist) {
        return ResponseError("Nama barang sudah digunakan.", 400);
      }

      const data =
        discountPrice && discountQuantity
          ? {
              name: name,
              price: parseInt(price),
              userId: token.id as string,
              discountPrice: parseInt(discountPrice),
              discountQuantity: parseInt(discountQuantity),
            }
          : {
              name: name,
              price: parseInt(price),
              userId: token.id as string,
            };

      const product = await Product.create(data);

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Berhasil menambahkan barang.",
        data: product,
      });
    }

    return NextResponse.json(
      {
        status: 401,
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");

    if (typeof token === "object" && "id" in token) {
      const product = await Product.find({
        userId: token.id as string,
        name: {
          $regex: search.trim().toLowerCase(),
          $options: "i",
        },
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Product.countDocuments({
        userId: token.id as string,
        name: {
          $regex: search.trim().toLowerCase(),
          $options: "i",
        },
      });

      return NextResponse.json({
        status: 200,
        success: true,
        data: product,
        pagination: {
          page: page,
          limit: limit,
          total,
        },
        message: "Berhasil mengambil data barang.",
      });
    }

    return NextResponse.json(
      {
        status: 401,
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token instanceof NextResponse) {
      return token;
    }
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const { name, price, discountPrice, discountQuantity } = await req.json();

    const data =
      discountPrice && discountQuantity
        ? {
            name: name,
            price: parseInt(price),
            discountPrice: parseInt(discountPrice),
            discountQuantity: parseInt(discountQuantity),
          }
        : {
            name: name,
            price: parseInt(price),
          };

    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        ...data,
      },
      { new: true }
    );

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Berhasil mengubah data barang.",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const token = await verifyToken(req);
  try {
    if (token instanceof NextResponse) {
      return token;
    }
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    await Product.findByIdAndDelete({ _id: id });
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Berhasil menghapus data barang.",
    });
  } catch (error) {
    console.log(error);
    return ResponseError("Internal Server Error", 500);
  }
}
