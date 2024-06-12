import { NextResponse, NextRequest } from "next/server";
import { getPostContentVersions } from "@/app/utils/getPostContentVersions";

interface Props {
  params: {
    postId: string;
  };
}

export async function GET(request: NextRequest, { params: { postId } }: Props) {
  const result = await getPostContentVersions(postId);
  return NextResponse.json(result);
}
