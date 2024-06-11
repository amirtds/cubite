import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getSiteData } from "@/app/utils/getSiteData";
import { updateSite } from "@/app/utils/updateSite";
import { deleteSite } from "@/app/utils/deleteSite";

interface Props {
  params: { domainName: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  const site = await getSiteData(params.domainName, session?.user.email);

  return NextResponse.json(site);
}

export async function PUT(request: NextRequest) {
  const { siteId, updateData } = await request.json();
  const result = await updateSite(siteId, updateData);
  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const { domainName } = await request.json();
  if (!domainName) {
    return NextResponse.json({
      status: 400,
      message: "Domain name is required",
    });
  }
  const result = await deleteSite(domainName);
  return NextResponse.json(result, { status: result.status });
}