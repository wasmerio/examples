export const MenuItems = [
  { link: "/", text: "Inicio" ,  submenu: null},
  {
    link: "#",
    text: "Noticias",
    submenu: [
      { link: "#", text: "Mas Leídas" || null },
      { link: "#", text: "Tendencias"  || null},
      { link: "#", text: "Nacionales"  || null},
    ],
  },
  { link: "#", text: "Negocios",  submenu: null },
  { link: "#", text: "hamburguesas",  submenu: null },
  { link: "#", text: "Tecnología",  submenu: null },
  { link: "#", text: "Moda",  submenu: null},
  {
    link: "#" || null,
    text: "Salud" || null,
    submenu: [
      {
        link: "#",
        text: "Fitness",
        submenu: [
          { link: "#", text: "Eventos"  || null},
          { link: "#", text: "Dopados" || null },
          { link: "#", text: "12" || null },
        ],
      },
      {
        link: "#" || null,
        text: "Salud" || null,
        submenu: [
          { link: "#", text: "Eventos"  || null},
          { link: "#", text: "Dopados"  || null},
          { link: "#", text: "12"  || null},
        ],
      },
      { link: "#", text: "12" ,  submenu: [] },
    ],
  },
];
