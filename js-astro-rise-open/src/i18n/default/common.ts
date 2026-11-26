export default {
  // Common translation in BaseLayout, Navbar and Footer
  title: 'AstroRise',
  brand: '🚀 AstroRise',
  navigation: [
    {
      label: 'Home',
      link: '/',
    },
    {
      label: 'Plans',
      link: '/plans',
    },
    {
      label: 'About',
      link: '/about',
    },
  ],
  footer: {
    rights: () => `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
    // If you want to show the year range, you can use the following code and comment the above line
    // rights: () => `© 2024-${new Date().getFullYear()} Your Company. All rights reserved.`,
  },
};
