import { NextResponse, NextRequest } from "next/server";
import { getSitePublicData } from "@/app/utils/getSitePublicData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId");
  
  if (!siteId) {
    return NextResponse.json(
      { status: 400, message: "Site ID is required." }
    );
  }

  const result = await getSitePublicData(siteId);
  return NextResponse.json(result, { status: result.status });
}
