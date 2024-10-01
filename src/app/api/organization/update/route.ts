import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { organizationId, newOrganizationName } = body;

  const updatedOrganization = await db.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      name: newOrganizationName,
    },
  });

  return NextResponse.json({ updatedOrganization }, { status: 200 });
}
