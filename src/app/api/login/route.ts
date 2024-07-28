import { PrismaGetInstance } from "@/lib/prisma-pg";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as jose from "jose";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { addHours } from "date-fns";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const schema = z.object({
      email: z.string().email(),
    });

    const data = await request.json();

    const { email } = schema.parse(data);

    const prisma = PrismaGetInstance();
    const user = await prisma.userMagic.upsert({
      where: {
        email,
      },
      update: {},
      create: {
        email,
      },
    });

    const secret = new TextEncoder().encode(
      "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
    );

    const jwt = await new jose.SignJWT({
      sub: user.id,
      email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "sydnee.schuppe@ethereal.email",
        pass: "NFTsY3fQy7u13FThvP",
      },
    });

    const info = await transporter.sendMail({
      from: '"Orbit" <orbitdev@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "ORBIT Login - Seu link de login", // Subject line
      html: `<p>Olá ${email}, <br>Seu link de login é: <a href="http://localhost:3000/login?token=${jwt}">Clique aqui</a></p>`,
    });

    console.log("[LOGIN] Email enviado", info);
    console.log("[LOGIN] Email preview", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log("[LOGIN] Error", error);
    return NextResponse.json({}, { status: 401 });
  }
}
