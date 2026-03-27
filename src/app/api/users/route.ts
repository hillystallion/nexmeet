import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateCode } from "@/lib/utils";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      code: true,
      createdAt: true,
      _count: { select: { attendances: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let code = generateCode();

    // Ensure unique code
    while (await prisma.user.findUnique({ where: { code } })) {
      code = generateCode();
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, code },
    });

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email, code: user.code },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
