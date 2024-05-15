"use server";

import { createSite } from "../../../utils/createSite"

export const registerSite = async (prevState: any, formData: FormData) =>{
    // Extract relevant form data fields
    const siteName = formData.get("siteName")?.toString() || '';
    const subDomain = formData.get("subDomain")?.toString() || '';
    const customDomain = formData.get("customDomain")?.toString() || '';
    const theme = formData.get("theme")?.toString() || 'sunset';
    const userEmail = formData.get("userEmail")?.toString() || '';

    // Ensure userEmail is provided
    if (!userEmail) {
        return {
            status: 400,
            message: "User email is missing. Please ensure you are logged in."
        };
        }
    // Create a site object to pass to the createSite function
    const siteObject = {
        siteName,
        subDomain,
        customDomain,
        theme,
        userEmail,
    };

    const newSite = await createSite(siteObject)
    return newSite
}