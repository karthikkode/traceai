import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  const user = await db.user.findUnique({ where: { email: email } });
  const userId = user?.id;
  const userAssets = db.userAccess.findMany({
    where: { userId: userId },
    include: {
      trace: {
        include: {
          project: {
            include: { organization: true },
          },
        },
      },
    },
  });

  return NextResponse.json(userAssets);
}
