// i18n/next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'fa', 'fr'], // اللغات التي ترغب في دعمها
  },
  localePath: path.resolve('./public/locales'), // المسار إلى ملفات الترجمات
};
