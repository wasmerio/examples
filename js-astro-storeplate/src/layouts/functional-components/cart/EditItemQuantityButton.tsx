import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { updateCartItemQuantity, refreshCartState } from "@/cartStore";
import type { CartItem } from "@/lib/shopify/types";
import LoadingDots from "../loadings/LoadingDots";

interface Props {
  item: CartItem;
  type: "plus" | "minus";
}

const EditItemQuantityButton: React.FC<Props> = ({ item, type }) => {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity < 1) return;

    setPending(true);

    try {
      await updateCartItemQuantity({
        lineId: item.id,
        variantId: item.merchandise.id,
        quantity: newQuantity,
      });

      await refreshCartState();
      setMessage("Quantity updated");
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setMessage("Failed to update quantity");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        aria-label={
          type === "plus" ? "Increase item quantity" : "Reduce item quantity"
        }
        aria-disabled={pending}
        disabled={pending}
        className={`ease flex h-full min-w-[36px] max-w-[36px] items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 ${type === "minus" ? "ml-auto" : ""
          } ${pending ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {pending ? (
          <LoadingDots className="bg-black dark:bg-white" />
        ) : type === "plus" ? (
          <FaPlus className="h-4 w-4 dark:text-neutral-500" />
        ) : (
          <FaMinus className="h-4 w-4 dark:text-neutral-500" />
        )}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
};

export default EditItemQuantityButton;
