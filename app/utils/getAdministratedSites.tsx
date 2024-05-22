import { prisma } from "@/prisma/client";

// Utility function to get administrated sites by a user
export const getAdministratedSites = async (userEmail: string) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  // Ensure user exists
  if (!user) {
    return {
      status: 400,
      message: "User not found.",
    };
  }

  // Get the sites the user is an admin of
  const sites = await prisma.site.findMany({
    where: {
      admins: {
        some: {
          id: user.id, // Use user.id instead of userId
        },
      },
    },
  });

  return {
    status: 200,
    message: "Successfully fetched administrated sites",
    sites,
  };
};
