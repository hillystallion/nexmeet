import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET() {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const host = await prisma.host.findUnique({
    where: { id: hostId },
    select: { id: true, name: true, email: true },
  });
  if (!host) {
    return NextResponse.json({ error: "Host not found" }, { status: 404 });
  }
  return NextResponse.json(host);
}
