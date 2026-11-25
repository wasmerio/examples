import React, { useState, useEffect, useRef } from "react";
import type { ProductVariant } from "@/lib/shopify/types";
import { BiLoaderAlt } from "react-icons/bi";
import { addItemToCart } from "@/cartStore";

interface SubmitButtonProps {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  stylesClass: string;
  handle: string | null;
  pending: boolean;
  onClick: () => void;
}

function SubmitButton({
  availableForSale,
  selectedVariantId,
  stylesClass,
  handle,
  pending,
  onClick,
}: SubmitButtonProps) {
  const buttonClasses = stylesClass;
  const disabledClasses = "cursor-not-allowed flex";

  const DynamicTag = handle === null ? "button" : "a";

  if (!availableForSale) {
    return (
      <button
        disabled
        aria-disabled
        className={`${buttonClasses} ${disabledClasses}`}
      >
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <DynamicTag
        href={`/products/${handle}`}
        aria-label="Please select an option"
        aria-disabled
        className={`${buttonClasses} ${DynamicTag === "button" ? disabledClasses : ""}`}
      >
        Select Variant
      </DynamicTag>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add to cart"
      aria-disabled={pending ? "true" : "false"}
      className={`${buttonClasses}`}
    >
      {pending ? (
        <BiLoaderAlt
          className={`animate-spin w-[70px] md:w-[85px]`}
          size={26}
        />
      ) : (
        "Add To Cart"
      )}
    </button>
  );
}
interface AddToCartProps {
  variants: ProductVariant[];
  availableForSale: boolean;
  stylesClass: string;
  handle: string | null;
  defaultVariantId: string | undefined;
}
export function AddToCart({
  variants,
  availableForSale,
  stylesClass,
  handle,
  defaultVariantId,
}: AddToCartProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(defaultVariantId);
  const lastUrl = useRef(window.location.href);

  // Function to update selectedVariantId based on URL
  const updateSelectedVariantFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedOptions = Array.from(searchParams.entries());

    const variant = variants.find((variant) =>
      selectedOptions.every(([key, value]) =>
        variant.selectedOptions.some(
          (option) =>
            option.name.toLowerCase() === key && option.value === value,
        ),
      ),
    );

    setSelectedVariantId(variant?.id || defaultVariantId);
  };

  useEffect(() => {
    // Update selected variant on mount and whenever the variants change
    updateSelectedVariantFromUrl();

    // Set up popstate listener for browser navigation
    const handlePopState = () => {
      updateSelectedVariantFromUrl();
    };

    // Set up URL change detection
    const detectUrlChange = () => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl.current) {
        lastUrl.current = currentUrl;
        updateSelectedVariantFromUrl();
      }
    };

    // Set up observers
    window.addEventListener("popstate", handlePopState);

    // Check for URL changes every 100ms
    const urlCheckInterval = setInterval(detectUrlChange, 100);

    // Clean up
    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearInterval(urlCheckInterval);
    };
  }, [variants, defaultVariantId]);

  // Optional: Listen to pushState and replaceState
  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      updateSelectedVariantFromUrl();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      updateSelectedVariantFromUrl();
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  const handleSubmit = async (e?: React.ChangeEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!selectedVariantId) return;

    setPending(true);
    try {
      const result = await addItemToCart(selectedVariantId);
      setMessage(result);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        stylesClass={stylesClass}
        handle={handle}
        pending={pending}
        onClick={handleSubmit}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </>
  );
}
