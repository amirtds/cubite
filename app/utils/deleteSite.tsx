import { prisma } from "@/prisma/client";

export const deleteSite = async (domainName: string) => {
  try {
    const site = await prisma.site.findUnique({
      where: {
        domainName: domainName,
      },
    });

    if (!site) {
      return {
        status: 404,
        message: "Site not found",
      };
    }

    // Delete the associated pages
    const deletePages = await prisma.page.deleteMany({
      where: {
        sites: {
          some: {
            id: site.id,
          },
        },
      },
    });

    const deletedSite = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });

    return {
      status: 200,
      message: "Site deleted successfully",
      site: deletedSite,
    };
  } catch (error) {
    console.error("Error deleting site:", error);
    return {
      status: 500,
      message: "Failed to delete site",
    };
  }
};
