import { NextRequest } from "next/server";
import { ResponseError } from "./ResponseError";
import jwt from "jsonwebtoken";

export default async function verifyToken(req: NextRequest) {
  const accessToken = req.headers.get("Authorization")?.split(" ")[1];

  if (!accessToken) {
    return ResponseError("Unauthorized", 401);
  }

  const user = jwt.verify(accessToken, process.env.NEXTAUTH_SECRET as string);

  return user;
}
