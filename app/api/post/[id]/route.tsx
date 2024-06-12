import { NextResponse, NextRequest } from "next/server";
import { getPost } from "@/app/utils/getPost";
import { updatePost } from "@/app/utils/updatePost";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const result = await getPost(id);
  if (result.status === 200) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json(result);
  }
}

export async function PUT(request: NextRequest) {
  const postData = await request.json();
  console.log(postData);
  const result = await updatePost(postData);
  return NextResponse.json(result, { status: result.status });
}
