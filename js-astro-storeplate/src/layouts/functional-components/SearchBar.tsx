import React, { useEffect, useState } from "react";
import { IoSearch, IoClose } from "react-icons/io5";

const SearchBar = () => {
  const [isInputEditing, setInputEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q");
    if (query) {
      setInputValue(query);
      setInputEditing(true);
    }

    const inputField = document.getElementById("searchInput") as HTMLInputElement;
    if (isInputEditing || query) {
      inputField.focus();
    }
  }, [isInputEditing]);

  const updateURL = (query: string) => {
    const newURL = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
    // window.history.pushState({}, '', newURL);
    window.location.href = newURL.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEditing(true);
    setInputValue(e.target.value);

    updateURL(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    setInputEditing(false);
    updateURL("");
  };

  const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.search as HTMLInputElement;
    updateURL(searchInput.value);
  };

  return (
    <form onSubmit={onSubmit} className="border border-border dark:border-darkmode-border rounded-full flex bg-light/90 dark:bg-dark/10 pl-4 relative">
      <input
        type="text"
        name="search"
        placeholder="Search for products"
        autoComplete="off"
        value={inputValue}
        onChange={handleChange}
        id="searchInput"
        className="bg-transparent border-none search-input focus:ring-transparent p-2 w-full"
      />
      <div className="absolute right-0 top-0 flex h-full items-center">
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 m-1 rounded-full"
          >
            <IoClose className="h-4 w-4" />
          </button>
        )}
        <button type="submit" className="search-icon p-2 m-1 rounded-full">
          <IoSearch className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
