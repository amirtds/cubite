import { prisma } from "@/prisma/client";

interface SiteData {
  siteName: string;
  subDomain: string;
  customDomain: string;
  theme: string;
  userEmail: string;
}

export const createSite = async (data: SiteData) => {
  // Check if the site with the specified subdomain exists
  const existingSite = await prisma.site.findUnique({
    where: {
      domainName: `${data.subDomain}.cubite.io`,
    },
  });

  if (existingSite) {
    return {
      status: 400,
      message: "Site already exists. Please choose a different subdomain.",
    };
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: data.userEmail,
    },
  });

  // Ensure user exists
  if (!user) {
    return {
      status: 400,
      message: "User not found.",
    };
  }

  // Create a new site and assign the user as the site admin
  const newSite = await prisma.site.create({
    data: {
      name: data.siteName,
      domainName: `${data.subDomain}.cubite.io`,
      customDomain: data.customDomain,
      themeName: data.theme,
      isActive: true,
      frontendConfig: {},
      admins: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return {
    status: 201,
    message: "Successfully created a new site",
    site: {
      id: newSite.id,
      name: newSite.name,
      domainName: newSite.domainName,
      customDomain: newSite.customDomain,
    },
  };
};