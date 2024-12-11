import { prisma } from "@/prisma/client";

// Utility function to get public site data
export const getSitesPublicData = async () => {
  try {
    // Fetch data for all sites
    const sites = await prisma.site.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        favicon: true,
        domainName: true,
        customDomain: true,
        languages: true,
        themeName: true,
        courses: {
          include: {
            topics: true,
            subjects: true,
            instructors: true,
            contents: true,
          },
        },
        pages: true,
        features: true,
        isActive: true,
        frontendConfig: true,
        layout: true,
        extraRegistrationFields: true,
        isOpenedxSite: true,
        openedxSiteUrl: true,
      },
    });

    return {
      status: 200,
      sites,
    };
  } catch (error) {
    console.error("Error fetching site data:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
