import { prisma } from "@/prisma/client";

// Utility function to update site information
export const updateSite = async (siteId, updateData) => {
  try {
    console.log(updateData.languages);
    const updatedSite = await prisma.site.update({
      where: {
        id: siteId,
      },
      data: {
        ...updateData,
        languages: {
          set: updateData.languages,
        },
      },
    });
    return {
      status: 200,
      message: "Site updated successfully",
      site: updatedSite,
    };
  } catch (error) {
    console.error("Error updating site:", error);
    return {
      status: 500,
      message: "Failed to update site",
    };
  }
};
