import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") as unknown as string;

  const user = await db.user.findUnique({
    where: { email: email },
    select: { id: true, username: true, email: true, image: true },
  });
  const userId = user?.id;

  const userAssets = await db.userAccess.findMany({
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

  let traces: any = [];
  let projects: any = [];
  let organization;
  userAssets.map((item, index) => {
    const trace: any = {
      id: item.traceId,
      accessType: item.accessType,
      name: item.trace.name,
      projectID: item.trace.project.id,
      organizationId: item.trace.project.organization.id,
    };

    traces = [...traces, trace];

    const project: any = {
      id: item.trace.project.id,
      name: item.trace.project.name,
      organizationId: item.trace.project.organization.id,
    };
    const isDuplicateProject = projects.some(
      (project: any) => project.id === item.trace.project.id
    );
    if (!isDuplicateProject) projects = [...projects, project];

    organization = {
      id: item.trace.project.organization.id,
      name: item.trace.project.organization.name,
    };
  });

  return NextResponse.json({ user, traces, projects, organization });
}
