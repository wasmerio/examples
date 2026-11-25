const navigationData = [
    {
        label: "menu.list.home",
        href: "/",
        children: [],
    },
    {
        label: "menu.list.about",
        href: "/about",
        children: [],
    },
    {
        label: "menu.list.pages",
        href: "/pages",
        children: [],
    },
    {
        label: "menu.list.dynamicRouting",
        href: "/dynamic-routing",
        children: [
            {
                label: "menu.list.subpage-1",
                href: "/dynamic-routing/subpage-1",
            },
            {
                label: "menu.list.subpage-2",
                href: "/dynamic-routing/subpage-2",
            },
        ],
    },
    {
        label: "menu.list.blog",
        href: "/blog",
        children: [],
    },
    {
        label: "menu.list.pagination",
        href: "/blog-pagination",
        children: [],
    },
    {
        label: "menu.list.contact",
        href: "/contact",
        children: [],
    },
];
export default navigationData;
