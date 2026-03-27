import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signHostToken } from "@/lib/host-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const host = await prisma.host.findUnique({ where: { email } });
    if (!host) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const isValid = await bcrypt.compare(password, host.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = await signHostToken(host.id);
    const response = NextResponse.json({
      id: host.id,
      name: host.name,
      email: host.email,
    });
    response.cookies.set("host-token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
