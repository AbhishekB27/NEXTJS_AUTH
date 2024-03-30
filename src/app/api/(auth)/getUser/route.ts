import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const userId = (await getDataFromToken(request)) || "";
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "User Found Successfully",
      data: user,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
