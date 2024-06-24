import { NextResponse, NextRequest } from "next/server";
import { getPageContent } from "@/app/utils/getPageContent";
import { createPageContent } from "@/app/utils/createPageContent";

interface Props {
  params: {
    courseId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params: { courseId } }: Props
) {
  const result = await getPageContent(courseId);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const contentData = await request.json();
  const result = await createPageContent(contentData);
  return NextResponse.json(result);
}
