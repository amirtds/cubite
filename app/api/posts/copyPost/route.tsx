import { NextResponse, NextRequest } from "next/server";
import { copyPost } from "@/app/utils/copyPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getUserId } from "@/app/utils/getUserId";

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  const session = await getServerSession(authOptions);
  const userId = await getUserId(session?.user?.email);

  if (!postId) {
    return NextResponse.json({
      status: 400,
      message: "Post ID is required",
    });
  }
  const result = await copyPost(postId, userId.id);
  return NextResponse.json(result, { status: result.status });
}
