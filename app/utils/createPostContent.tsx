import { prisma } from "@/prisma/client";

interface PostContentData {
  postId: string;
  content: any;
  authorId: string;
}

export const createPostContent = async (data: PostContentData) => {
  try {
    const { postId, content, authorId } = data;

    // Get the current highest version for the course
    const currentVersion = await prisma.postContent.findMany({
      where: { postId },
      orderBy: { version: "desc" },
      take: 1,
    });

    const newVersion =
      currentVersion.length > 0 ? currentVersion[0].version + 1 : 1;

    // Save the new content
    const postContent = await prisma.postContent.create({
      data: {
        postId,
        content,
        version: newVersion,
        authorId,
      },
    });

    return {
      status: 201,
      message: "Course content saved successfully",
      postContent,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "An error occurred while fetching the course.",
      error: error.message,
    };
  }
};
