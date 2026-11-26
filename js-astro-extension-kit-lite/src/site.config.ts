// One file to rebrand the whole theme.
export const product = {
  name: 'Tabwise',
  tagline: 'Fifty tabs. One calm window.',
  version: '1.4.0',
  users: '38,000',
  rating: '4.8',
  demo: true,
  stores: {
    chrome: 'https://chromewebstore.google.com/',
    edge: 'https://microsoftedge.microsoft.com/addons',
    firefox: 'https://addons.mozilla.org/',
  },
  permissions: [
    { id: 'tabs', why: 'perm.tabs.why', never: 'perm.tabs.never' },
    { id: 'storage', why: 'perm.storage.why', never: 'perm.storage.never' },
    { id: 'contextMenus', why: 'perm.menus.why', never: 'perm.menus.never' },
  ],
};
