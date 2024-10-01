import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { projectId, traceName, userId } = body;

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  const trace = await db.trace.create({
    data: {
      name: traceName,
      project: {
        connect: {
          id: project?.id,
        },
      },
    },
  });

  const userAccess = await db.userAccess.create({
    data: {
      accessType: "owner",
      user: {
        connect: {
          id: userId,
        },
      },
      trace: {
        connect: {
          id: trace.id,
        },
      },
    },
  });

  return NextResponse.json({ trace, userAccess });
}
