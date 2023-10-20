// noinspection JSUnusedGlobalSymbols
module.exports = {
    env: {
        basePath: process.env.BASE_PATH || '',
    },
    basePath: process.env.BASE_PATH || '',
    i18n: {
        locales: ['en', 'ru', 'ar', 'nl'],
        defaultLocale: 'en',
    },
    eslint: {
        ignoreDuringBuilds: true
    }
};
