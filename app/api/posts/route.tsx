import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getPosts } from "@/app/utils/getPosts";
import { createPost } from "@/app/utils/createPost";
import { deletePost } from "@/app/utils/deletePost";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const result = await getPosts(session.user.email);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await createPost({
    title: body.title,
    description: body.description,
    permalink: body.permalink,
    subjects: body.subjects,
    topics: body.topics,
    image: body.image,
    authors: body.authors,
    sites: body.selectedSites,
    blurb: body.blurb,
  });
  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const { postId } = await request.json();
  if (!postId) {
    return NextResponse.json({
      status: 400,
      message: "Post ID is required",
    });
  }
  const result = await deletePost(postId);
  return NextResponse.json(result, { status: result.status });
}
