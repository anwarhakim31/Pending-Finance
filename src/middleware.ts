import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authPage = ["login", "register", "forget-password"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  if (token && authPage.includes(pathname.split("/")[1])) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (token && pathname.startsWith("/record")) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records?` +
        new URLSearchParams({
          userId: token.id as string,
          recordId: pathname.split("/")[2],
        })
    );

    if (!res.ok) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (!token && !authPage.includes(pathname.split("/")[1])) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/products",
    "/profile",
    "/record/:path*",
    "/history",
    "/login",
    "/register",
    "/forget-password",
  ],
};
