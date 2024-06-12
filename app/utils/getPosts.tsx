import { prisma } from "@/prisma/client";

export const getPosts = async (userEmail: string) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      administratedSites: true,
      siteRoles: true,
    },
  });

  if (!user) {
    return {
      status: 400,
      message: "User not found.",
    };
  }

  // Get the site IDs where the user is an admin or has a non-student role
  const adminSiteIds = user.administratedSites.map((site) => site.id);
  const nonStudentSiteIds = user.siteRoles
    .filter((role) => role.role !== "STUDENT")
    .map((role) => role.siteId);

  const siteIds = Array.from(new Set([...adminSiteIds, ...nonStudentSiteIds]));

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          authors: {
            some: {
              userId: user.id,
            },
          },
        },
        {
          sites: {
            some: {
              id: {
                in: siteIds,
              },
            },
          },
        },
      ],
    },
    include: {
      authors: {
        include: {
          user: true,
        },
      },
      sites: true,
    },
  });
  return {
    status: 200,
    posts,
  };
};
