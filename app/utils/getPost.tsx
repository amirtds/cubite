import { prisma } from "@/prisma/client";

export const getPost = async (id: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        subjects: true,
        topics: true,
        authors: {
          include: {
            user: true,
          },
        },
        sites: true,
      },
    });

    if (!post) {
      return {
        status: 404,
        message: "Course not found.",
      };
    }

    return {
      status: 200,
      post,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while fetching the course.",
      error: error.message,
    };
  }
};
