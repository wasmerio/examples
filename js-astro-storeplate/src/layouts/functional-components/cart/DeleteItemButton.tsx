import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { removeItemFromCart, refreshCartState } from "@/cartStore";
import LoadingDots from "../loadings/LoadingDots";

interface SubmitButtonProps {
  onClick: () => void;
  pending: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, pending }) => (
  <button
    type="submit"
    onClick={onClick}
    aria-label="Remove cart item"
    aria-disabled={pending}
    className={`ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 cursor-pointer ${pending ? "cursor-not-allowed px-0" : ""
      }`}
  >
    {pending ? (
      <LoadingDots className="bg-white" />
    ) : (
      <FaXmark className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
    )}
  </button>
);

interface DeleteItemButtonProps {
  item: {
    id: string;
  };
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ item }) => {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    try {
      await removeItemFromCart(item.id);
      await refreshCartState();
      setMessage("Item removed");
    } catch (error) {
      console.error("Error removing item:", error);
      setMessage("Error removing item");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton onClick={() => !pending} pending={pending} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
};

export default DeleteItemButton;
