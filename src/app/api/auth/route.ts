import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import { addHours } from "date-fns";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.token) {
      return NextResponse.json({}, { status: 401 });
    }

    const token = data.token;

    const secret = new TextEncoder().encode(
      "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
    );

    const { payload, protectedHeader } = await jose.jwtVerify(token, secret);

    cookies().set({
      name: "auth-session",
      value: token,
      httpOnly: true,
      expires: addHours(new Date(), 24),
      path: "/",
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log("[LOGIN] Error", error);
    return NextResponse.json({}, { status: 401 });
  }
}
