import { prisma } from "@/prisma/client";

interface SiteData {
  siteName: string;
  subDomain: string;
  customDomain: string;
  theme: string;
  userEmail: string;
  isOpenedxSite: boolean;
  isNewOpenedxSite: boolean;
  openedxSiteUrl: string;
}

export const createSite = async (data: SiteData) => {
  // Check if the site with the specified subdomain exists
  const existingSite = await prisma.site.findUnique({
    where: {
      domainName: `${data.subDomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
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
      domainName: `${data.subDomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
      customDomain: data.customDomain,
      themeName: data.theme,
      isActive: true,
      frontendConfig: {},
      isOpenedxSite: data.isOpenedxSite,
      isNewOpenedxSite: data.isNewOpenedxSite,
      openedxSiteUrl: data.openedxSiteUrl,
      admins: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  // Create the index page for the new site
  const indexPage = await prisma.page.create({
    data: {
      title: "Index",
      permalink: `index-${newSite.id}`,
      isProtected: true,
      authors: {
        create: [{ user: { connect: { id: user.id } } }],
      },
      sites: {
        connect: { id: newSite.id },
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
      indexPageId: indexPage.id, // Include the ID of the index page
    },
  };
};
