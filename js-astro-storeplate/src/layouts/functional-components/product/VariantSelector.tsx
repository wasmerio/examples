import React, { useState, useEffect } from "react";
import { BsCheckLg } from "react-icons/bs";
import VariantDropDown from "./VariantDropDown";
import type { ImageItem } from "./ProductGallery";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export const generateImageMap = (images: ImageItem[]) => {
  const imageMap: { [altText: string]: string } = {};

  images.forEach((image) => {
    if (!(image.altText in imageMap)) {
      imageMap[image.altText] = image.url;
    }
  });

  return imageMap;
};

export function VariantSelector({ options, variants, images }: {
  options: ProductOption[];
  variants: ProductVariant[];
  images: ImageItem[];
}) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | undefined>>({
    color: undefined,
    size: undefined,
  });

  const imageMap = generateImageMap(images);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    setSelectedOptions({ color, size } as Record<string, string | undefined>);
  }, []);

  const updateUrl = (param: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(param, value);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
    updateUrl(optionName, value);
  };

  const combinations = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {}
    ),
  }));

  // Filter out options where name is "Title" and values are ["Default Title"]
  const filteredOptions = options.filter(
    (option) => !(option.name === "Title" && option.values.includes("Default Title"))
  );

  const sizeOption = options.find((option) => option.name === "Size");

  return (
    <div>
      {filteredOptions.map((option) => (
        <div key={option.id}>
          <h5 className="mb-2 max-md:text-base">
            {option.name === "Size" ? "" : option.name}
          </h5>
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();
              const isAvailableForSale = combinations.find(
                (combination: Combination) =>
                  combination[optionNameLowerCase] === value &&
                  combination.availableForSale
              );

              const isActive = selectedOptions[optionNameLowerCase] === value;

              if (option.name === "Size") {
                return null; // Skip rendering size in the loop
              }

              return (
                <div key={value}>
                  <button
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    onClick={() => handleOptionChange(optionNameLowerCase, value)}
                    title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                    className={`flex min-w-[48px] items-center justify-center rounded-md border border-border text-sm cursor-pointer ${isActive && option.name !== "Color"
                      ? "cursor-default ring-2 ring-dark dark:ring-darkmode-dark"
                      : ""
                      } ${!isActive && isAvailableForSale && option.name !== "Color"
                        ? "ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-dark hover:dark:ring-darkmode-dark"
                        : ""
                      } ${!isAvailableForSale
                        ? "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                        : ""
                      }`}
                  >
                    {option.name === "Color" ? (
                      <div
                        className={`relative rounded-md overflow-hidden ${isActive ? "outline-1 outline-dark dark:outline-darkmode-dark" : ""
                          }`}
                      >
                        <img
                          src={imageMap[value]}
                          alt={value}
                          width={50}
                          height={50}
                          className={`${isActive ? "opacity-80" : ""}`}
                        />
                        {isActive && (
                          <span className="text-inherit h-full opacity-100 absolute top-2 right-2">
                            <BsCheckLg size={35} />
                          </span>
                        )}
                      </div>
                    ) : (
                      value
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {sizeOption && (
        <div className="mb-8 mt-8">
          <h5 className="mb-2 max-md:text-base">{sizeOption.name}</h5>
          <VariantDropDown
            sizeOption={sizeOption}
            selectedSize={selectedOptions.size}
            onSizeChange={(value: string) => handleOptionChange("size", value)}
          />
        </div>
      )}
    </div>
  );
}
