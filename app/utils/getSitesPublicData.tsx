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
        domainName: true,
        customDomain: true,
        themeName: true,
        courses: {
          include: {
            topics: true,
            subjects: true,
            instructors: true,
          },
        },
        pages: true,
        features: true,
        isActive: true,
        frontendConfig: true,
        layout: true,
        extraRegistrationFields: true,
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
