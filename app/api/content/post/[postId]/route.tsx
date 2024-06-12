import { NextResponse, NextRequest } from "next/server";
import { getPostContent } from "@/app/utils/getPostContent";
import { createPostContent } from "@/app/utils/createPostContent";

interface Props {
  params: {
    courseId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params: { courseId } }: Props
) {
  const result = await getPostContent(courseId);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const contentData = await request.json();
  console.log(contentData);
  const result = await createPostContent(contentData);
  return NextResponse.json(result);
}
