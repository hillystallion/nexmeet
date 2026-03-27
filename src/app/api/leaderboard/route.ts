import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      points: true,
      level: true,
      streak: true,
      image: true,
      _count: {
        select: {
          attendances: true,
          badges: true,
        },
      },
    },
    orderBy: { points: "desc" },
    take: 20,
  });

  return NextResponse.json(users);
}
