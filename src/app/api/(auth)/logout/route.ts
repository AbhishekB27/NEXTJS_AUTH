import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function POST(request: NextResponse) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successfully",
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
