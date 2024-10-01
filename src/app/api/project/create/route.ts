import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { organizationId, projectName } = body;

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
  });

  const project = await db.project.create({
    data: {
      name: projectName,
      organization: {
        connect: {
          id: organization?.id,
        },
      },
    },
  });

  return NextResponse.json({ project });
}
