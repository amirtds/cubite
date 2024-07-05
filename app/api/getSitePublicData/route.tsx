import { NextResponse, NextRequest } from "next/server";
import { getSitePublicData } from "@/app/utils/getSitePublicData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get("domainName");

  if (!domainName) {
    return NextResponse.json(
      { status: 400, message: "Domain name is required." },
      { status: 400 }
    );
  }

  const result = await getSitePublicData(domainName);

  return NextResponse.json(result, { status: result.status });
}
