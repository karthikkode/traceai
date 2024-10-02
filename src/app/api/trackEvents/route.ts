import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    sessionId,
    tagName,
    elementId,
    classList,
    innerText,
    href,
    outerHTML,
    timestamp,
    url,
  } = body;

  const eventData = await db.eventData.create({
    data: {
      sessionId: sessionId,
      tagName: tagName,
      elementId: elementId,
      classList: classList,
      innerText: innerText,
      href: href,
      outerHTML: outerHTML,
      timestamp: timestamp,
      url: url,
    },
  });

  const response = NextResponse.json(eventData);
  response.headers.set("Access-Control-Allow-Origin", "*"); // You can replace "*" with your frontend domain
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, PUT, DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
