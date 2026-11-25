const themeDir = __dirname;

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('postcss-import')({}),
    require('tailwindcss')(themeDir + '/tailwind.config.js'),
    require('autoprefixer')({
      path: [themeDir]
    })
  ]
};

export default config;
