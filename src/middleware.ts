import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const tokenFromCookie = cookies().get("auth-session");

  if (tokenFromCookie) {
    const secret = new TextEncoder().encode(
      "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
    );

    try {
      const { payload, protectedHeader } = await jose.jwtVerify(
        tokenFromCookie.value,
        secret
      );
      return NextResponse.next();
    } catch (error) {
      console.log("[MIDDLEWARE] Error", error);
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/"],
};
