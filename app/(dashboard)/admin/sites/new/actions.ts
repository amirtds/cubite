"use server";

import { createSite } from "@/app/utils/createSite"

export const createSiteAction = async (prevState: any, formData: FormData) =>{
    // Extract relevant form data fields
    const siteName = formData.get("siteName")?.toString() || '';
    const subDomain = formData.get("subDomain")?.toString() || '';
    const customDomain = formData.get("customDomain")?.toString() || '';
    const theme = formData.get("theme")?.toString() || 'business';
    const userEmail = formData.get("userEmail")?.toString() || '';
    const isOpenedxSite = formData.get("isOpenedxSite") === "on";
    const isNewOpenedxSite = formData.get("isNewOpenedxSite") === "on";
    const openedxSiteUrl = formData.get("openedxSiteUrl")?.toString() || '';

    // Ensure userEmail is provided
    if (!userEmail) {
        return {
            status: 400,
            message: "User email is missing. Please ensure you are logged in."
        };
    } else if (!siteName) {
        return {
            status: 400,
            message: "Site name is missing. Please ensure you have provided a site name."
        };
    } else if (!subDomain) {
        return {
            status: 400,
            message: "Subdomain is missing. Please ensure you have provided a subdomain."
        };
    }
    // Create a site object to pass to the createSite function
    const siteObject = {
        siteName,
        subDomain,
        customDomain,
        theme,
        userEmail,
        isOpenedxSite,
        isNewOpenedxSite,
        openedxSiteUrl,
    };

    const newSite = await createSite(siteObject)
    return newSite
}