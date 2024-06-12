import { prisma } from "@/prisma/client";

export const deletePost = async (postId: string) => {
  try {
    const post = await prisma.post.delete({
      where: { id: postId },
    });

    return {
      status: 200,
      message: "Post deleted successfully",
      post,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while deleting the post.",
      error: error.message,
    };
  }
};
