import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Convert Headers object to plain object
  const headersList = Object.fromEntries(headers().entries());

  // Use Negotiator to get languages
  const negotiator = new Negotiator({ headers: headersList });
  const languages = negotiator.languages();

  // Define your locales and defaultLocale
  const locales = ["en", "en-US", "es-419", "pt-BR"];
  const defaultLocale = "en-US";

  // Try to get the language from the cookie
  const cookieStore = cookies();
  const storedLanguage = cookieStore.get("selectedLanguage")?.value;

  let locale;

  if (storedLanguage && locales.includes(storedLanguage)) {
    locale = storedLanguage;
  } else {
    // Use match function to get the best matching locale if no stored language
    locale = match(languages, locales, defaultLocale);
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
