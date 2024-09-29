import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { organizationName } = body;

  const organization = await db.organization.create({
    data: { name: organizationName },
  });

  const defaultProject = await db.project.create({
    data: {
      name: "Default",
      organization: {
        connect: {
          id: organization.id,
        },
      },
    },
  });

  const defaultTrace = await db.trace.create({
    data: {
      name: "Default",
      project: {
        connect: {
          id: defaultProject.id,
        },
      },
    },
  });

  return NextResponse.json({ organization, defaultProject, defaultTrace });
}
