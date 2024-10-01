import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { projectId, newProjectId } = body;

  const updatedProject = await db.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: newProjectId,
    },
  });

  return NextResponse.json({ updatedProject }, { status: 200 });
}
