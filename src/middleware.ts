import { NextResponse } from "next/server";
import withAuth from "./middlewares/withAuth";

export const mainMiddleware = async () => {
  const res = NextResponse.next();

  return res;
};

export default withAuth(mainMiddleware, ["dashboard", "products"]);
