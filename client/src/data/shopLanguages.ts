// application
import { ILanguage } from '~/interfaces/language';

const dataShopLanguages: ILanguage[] = [
    {
        locale: 'en',
        code: 'en',
        name: 'English',
        icon: '/images/languages/language-1.png',
        direction: 'ltr',
    },
    {
        locale: 'ru',
        code: 'ru',
        name: 'Russian',
        icon: '/images/languages/language-2.png',
        direction: 'ltr',
    },
    {
        locale: 'ar',
        code: 'ar',
        name: 'RTL',
        icon: '/images/languages/language-3.png',
        direction: 'rtl',
    },{
        locale: 'nl',
        code: 'nl',
        name: 'Dutch',
        icon: '/images/languages/language-3.png',
        direction: 'ltr',
    },
];

export const dataShopDefaultLocale = 'en';

export default dataShopLanguages;
