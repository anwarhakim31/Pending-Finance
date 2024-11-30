import { prisma } from "@/lib/prisma";
import { ResponseError } from "@/lib/ResponseError";
import verifyToken from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = await verifyToken(req);

    const { name, price, discountPrice, discountQuantity } = await req.json();

    if (token && typeof token === "object" && "id" in token) {
      const product = await prisma.products.create({
        data: {
          name: name,
          price: price,
          userId: token.id as string,
          discountPrice: parseInt(discountPrice),
          discountQuantity: parseInt(discountQuantity),
        },
      });

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
  try {
    const token = await verifyToken(req);
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";

    if (typeof token === "object" && "id" in token) {
      const product = await prisma.products.findMany({
        where: {
          userId: token.id as string,
          name: {
            contains: search,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const total = await prisma.products.count({
        where: {
          userId: token.id as string,
          name: {
            contains: search,
          },
        },
      });

      return NextResponse.json({
        status: 200,
        success: true,
        data: product,
        pagination: {
          page: 1,
          limit: 10,
          total,
          pages: Math.ceil(total / 10),
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
  try {
    const token = await verifyToken(req);
    if (token instanceof NextResponse) {
      return token;
    }
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const { name, price, discountPrice, discountQuantity } = await req.json();

    const product = await prisma.products.update({
      where: {
        id: parseInt(id as string),
      },
      data: {
        name: name,
        price: price,
        discountPrice: parseInt(discountPrice),
        discountQuantity: parseInt(discountQuantity),
      },
    });
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
  try {
    const token = await verifyToken(req);
    if (token instanceof NextResponse) {
      return token;
    }
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    await prisma.products.delete({
      where: {
        id: parseInt(id as string),
      },
    });

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
