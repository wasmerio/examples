import { slugify } from "@/lib/utils/textConverter";
import React, { useState } from "react";

const ShowTags = ({ tags }: { tags: string[] }) => {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search)
  );
  const selectedTag = searchParams.get("t");

  const updateSearchParams = (newParams: URLSearchParams) => {
    const newParamsString = newParams.toString();
    const newURL = newParamsString
      ? `/products?${newParamsString}`
      : "/products";

    window.location.href = newURL.toString();
    setSearchParams(newParams);
  };

  const handleTagClick = (name: string) => {
    const slugName = slugify(name.toLowerCase());
    const newParams = new URLSearchParams(searchParams.toString());

    if (slugName === selectedTag) {
      newParams.delete("t");
    } else {
      newParams.set("t", slugName);
    }

    updateSearchParams(newParams);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`cursor-pointer px-2 py-1 rounded-md border border-border dark:border-darkmode-border text-text-light dark:text-darkmode-text-light ${selectedTag === slugify(tag.toLowerCase()) &&
            "bg-light dark:bg-dark"
            }`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default ShowTags;
