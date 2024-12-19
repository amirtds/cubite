import { prisma } from "@/prisma/client";


export const getSitePublicData = async (siteId: string) => {
  try {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: {
        id: true,
        name: true,
        domainName: true,
        logo: true,
        themeName: true,
        pages: true,
        courses: true
      },
    });
    return {
      status: 200,
      site,
    };
  } catch (error) {
    console.error("Error fetching site public data:", error);
    return {
      status: 500,
      message: "Error fetching site public data",
    };
  }
};
