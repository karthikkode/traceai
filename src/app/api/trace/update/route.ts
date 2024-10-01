import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { projectId, traceId } = body;

  const updatedTrace = await db.trace.update({
    where: {
      id: traceId,
    },
    data: {
      project: projectId,
    },
  });

  return NextResponse.json({ updatedTrace });
}
