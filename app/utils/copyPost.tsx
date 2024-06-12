import { prisma } from "@/prisma/client";

export const copyPost = async (postId: string, currentUserId: string) => {
  try {
    // Fetch the post along with its related data
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        subjects: true,
        topics: true,
        authors: true,
        sites: true,
      },
    });

    if (!post) {
      return {
        status: 404,
        message: "Post not found.",
      };
    }

    // Add current user to the authors list
    const authorIds = new Set(post.authors.map((author) => author.userId));
    authorIds.add(currentUserId);

    // Duplicate the post
    const newPost = await prisma.post.create({
      data: {
        title: `${post.title} (Copy)`,
        description: post.description,
        permalink: `${post.permalink}-copy-${Date.now()}`, // Ensure uniqueness
        image: post.image,
        subjects: {
          connect: post.subjects.map((subject) => ({ id: subject.id })),
        },
        topics: {
          connect: post.topics.map((topic) => ({ id: topic.id })),
        },
        authors: {
          create: Array.from(authorIds).map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
        sites: {
          connect: post.sites.map((site) => ({ id: site.id })),
        },
        blurb: post.blurb,
      },
    });

    return {
      status: 201,
      message: "Post duplicated successfully",
      newPost,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while duplicating the post.",
      error: error.message,
    };
  }
};
