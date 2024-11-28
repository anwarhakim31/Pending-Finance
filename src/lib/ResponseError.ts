import { NextResponse } from "next/server";

export const ResponseError = (message: string, status: number) => {
  return NextResponse.json({ status, success: false, message }, { status });
};
