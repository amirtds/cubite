import { prisma } from "@/prisma/client";

interface SiteResponse {
  status: number;
  message: string;
  site?: any;
}

export const getSitePublicData = async (
  domainName: string
): Promise<SiteResponse> => {
  try {
    if (!domainName) {
      return {
        status: 400,
        message: "Domain name is required.",
      };
    }

    const site = await prisma.site.findUnique({
      where: { domainName },
      include: {
        name: true,
        logo: true,
        themeName: true,
        courses: true,
        pages: true,
      },
    });

    if (!site) {
      return {
        status: 404,
        message: "Site not found.",
      };
    }

    return {
      status: 200,
      message: "Site data retrieved successfully.",
      site,
    };
  } catch (error) {
    console.error("Error fetching site data:", error);
    return {
      status: 500,
      message: "An error occurred while fetching the site data.",
    };
  }
};
