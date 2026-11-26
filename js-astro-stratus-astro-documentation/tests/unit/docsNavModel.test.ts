import { describe, expect, it } from "vitest";
import {
  buildDocsNav,
  comparePages,
  findCrumbs,
  findPager,
  orderGroupNames,
} from "../../src/utils/docsNavModel";

const page = (order: number, title: string) => ({ order, title });

describe("comparePages", () => {
  it("orders by the `order` frontmatter first", () => {
    expect(comparePages(page(1, "Zebra"), page(2, "Alpha"))).toBeLessThan(0);
  });

  it("falls back to title when the order matches", () => {
    expect(comparePages(page(1, "Alpha"), page(1, "Zebra"))).toBeLessThan(0);
    expect(comparePages(page(1, "Zebra"), page(1, "Alpha"))).toBeGreaterThan(0);
  });

  it("sorts a list the way the sidebar renders it", () => {
    const pages = [page(2, "B"), page(0, "C"), page(2, "A"), page(1, "D")];

    expect([...pages].sort(comparePages).map((entry) => entry.title)).toEqual(["C", "D", "A", "B"]);
  });
});

describe("orderGroupNames", () => {
  it("keeps the configured order", () => {
    expect(orderGroupNames(["Two", "One"], ["One", "Two"])).toEqual(["Two", "One"]);
  });

  it("drops a configured group that no page belongs to", () => {
    expect(orderGroupNames(["One", "Empty"], ["One"])).toEqual(["One"]);
  });

  it("appends unconfigured groups alphabetically after the configured ones", () => {
    expect(orderGroupNames(["Zed"], ["Zed", "Beta", "Alpha"])).toEqual(["Zed", "Alpha", "Beta"]);
  });

  // Renaming a `navGroups` entry cannot rename a group: membership comes from
  // each page's `group`, so the old name reappears in the alphabetical tail.
  it("orphans a renamed group into the tail rather than renaming it", () => {
    expect(orderGroupNames(["Renamed", "Reference"], ["Authoring", "Reference"])).toEqual([
      "Reference",
      "Authoring",
    ]);
  });

  it("returns nothing when no group has pages", () => {
    expect(orderGroupNames(["One", "Two"], [])).toEqual([]);
  });
});

describe("buildDocsNav", () => {
  const cfg = { navGroups: [{ name: "One" }, { name: "Two" }], homeLabel: "Overview" };

  it("groups root pages by their frontmatter group, in configured order", () => {
    const nav = buildDocsNav(
      [
        { id: "b", title: "B", group: "Two", order: 0 },
        { id: "a", title: "A", group: "One", order: 0 },
      ],
      cfg
    );

    expect(nav.groups.map((g) => g.name)).toEqual(["One", "Two"]);
    expect(nav.groups[0].pages.map((p) => p.href)).toEqual(["/a/"]);
  });

  it("nests by path and makes a child inherit its parent's group", () => {
    const nav = buildDocsNav(
      [
        { id: "theming", title: "Theming", group: "One", order: 0 },
        { id: "theming/tokens", title: "Tokens", group: "Two", order: 0 },
      ],
      cfg
    );

    const parent = nav.groups[0].pages[0];

    expect(nav.groups.map((g) => g.name)).toEqual(["One"]);
    expect(parent.children.map((c) => c.href)).toEqual(["/theming/tokens/"]);
    expect(parent.children[0].group).toBe("One");
  });

  it("leaves a page with no group out of the nav entirely", () => {
    const nav = buildDocsNav([{ id: "loose", title: "Loose", order: 0 }], cfg);

    expect(nav.groups).toEqual([]);
    expect(nav.byHref.has("/loose/")).toBe(false);
  });

  it("orders pages within a group by order then title", () => {
    const nav = buildDocsNav(
      [
        { id: "z", title: "Z", group: "One", order: 1 },
        { id: "a", title: "A", group: "One", order: 2 },
        { id: "m", title: "M", group: "One", order: 1 },
      ],
      cfg
    );

    expect(nav.groups[0].pages.map((p) => p.id)).toEqual(["m", "z", "a"]);
  });

  it("walks the reading order depth-first for the pager", () => {
    const nav = buildDocsNav(
      [
        { id: "a", title: "A", group: "One", order: 0 },
        { id: "a/child", title: "Child", order: 0 },
        { id: "b", title: "B", group: "One", order: 1 },
      ],
      cfg
    );

    expect(nav.reading.map((p) => p.href)).toEqual(["/", "/a/", "/a/child/", "/b/"]);
    expect(findPager(nav, "/a/child/")).toMatchObject({
      prev: { href: "/a/" },
      next: { href: "/b/" },
    });
  });

  it("builds the crumb trail as group, parent, page", () => {
    const nav = buildDocsNav(
      [
        { id: "a", title: "A", group: "One", order: 0 },
        { id: "a/child", title: "Child", order: 0 },
      ],
      cfg
    );

    expect(findCrumbs(nav, "/a/child/")).toEqual([
      { label: "One" },
      { label: "A", url: "/a/" },
      { label: "Child" },
    ]);
  });

  it("treats an index page as its directory", () => {
    const nav = buildDocsNav([{ id: "guide/index", title: "Guide", group: "One" }], cfg);

    expect(nav.groups[0].pages[0].href).toBe("/guide/");
  });
});
