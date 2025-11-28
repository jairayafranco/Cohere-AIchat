import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en'];
export const defaultLocale = 'es';

export default getRequestConfig(async ({ locale }) => ({
    messages: (await import(`./messages/${locale}.json`)).default
}));
