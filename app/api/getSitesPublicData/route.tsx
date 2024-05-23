import { NextResponse, NextRequest } from "next/server";
import { getSitesPublicData } from "@/app/utils/getSitesPublicData";

interface Props {
  params: { domainName: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const response = await getSitesPublicData();
  return NextResponse.json(response);
}
