import React, { useEffect, useState } from "react";
import { createUrl } from "@/lib/utils";

function PathFilterItem({ item }: { item: any }) {
  const [pathname, setPathname] = useState("");
  const [searchParams, setSearchParams] = useState(new URLSearchParams());

  useEffect(() => {
    setPathname(window.location.pathname);
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : "a";

  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={`w-full text-sm ${active ? "bg-green-400" : "hover:underline"
          }`}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: any }) {
  const [pathname, setPathname] = useState("");
  const [searchParams, setSearchParams] = useState(new URLSearchParams());

  useEffect(() => {
    setPathname(window.location.pathname);
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  // const q = searchParams.get("q");
  const newParams = new URLSearchParams(searchParams.toString());

  if (item.slug) {
    newParams.set("sort", item.slug);
  } else {
    newParams.delete("sort");
  }

  const href = createUrl(pathname, newParams);
  const active = searchParams.get("sort") === item.slug;
  const DynamicTag = active ? "p" : "a";

  return (
    <li
      className="flex text-sm text-text-dark hover:bg-dark/50 hover:text-white"
      key={item.title}
    >
      <DynamicTag
        href={href}
        className={`w-full pl-4 py-2 ${active ? "bg-dark text-white" : ""}`}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterDropdownItem({ item }: { item: any }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
