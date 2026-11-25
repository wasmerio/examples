export function initComboboxes() {
  document.querySelectorAll("[data-combobox]").forEach((combobox) => {
    if (combobox.hasAttribute("data-combobox-initialized")) return;
    combobox.setAttribute("data-combobox-initialized", "true");

    const triggerLabel = combobox.querySelector("[data-combobox-value]") as
      | HTMLElement
      | null;
    const popoverTrigger = combobox.querySelector("[data-popover-trigger]") as
      | HTMLElement
      | null;
    const popoverContent = combobox.querySelector("[data-popover-content]") as
      | HTMLElement
      | null;
    const hiddenInput = combobox.querySelector("[data-combobox-input]") as
      | HTMLInputElement
      | null;
    const clearButton = combobox.querySelector("[data-combobox-clear]") as
      | HTMLElement
      | null;
    const chevronIcon = combobox.querySelector("[data-combobox-chevron]") as
      | HTMLElement
      | null;
    const searchInput = combobox.querySelector("[data-command-input]") as
      | HTMLInputElement
      | null;
    const placeholder =
      combobox.getAttribute("data-combobox-placeholder") || "Select an option";
    const isDisabled = combobox.getAttribute("data-combobox-disabled") === "true";
    const isClearable =
      combobox.getAttribute("data-combobox-clearable") === "true";
    const items = Array.from(
      combobox.querySelectorAll("[data-combobox-item]")
    ) as HTMLElement[];
    const separators = Array.from(
      combobox.querySelectorAll("[data-combobox-group-separator]")
    ) as HTMLElement[];

    function getItemLabel(item: HTMLElement): string {
      return (
        item.getAttribute("data-label") ||
        item.querySelector(".flex-1")?.textContent?.trim() ||
        item.textContent?.trim() ||
        ""
      );
    }

    function updateGroupSeparators() {
      if (separators.length === 0) return;
      const groups = Array.from(
        combobox.querySelectorAll("[data-command-group]")
      ) as HTMLElement[];

      groups.forEach((group, index) => {
        const hasVisibleItems = Array.from(
          group.querySelectorAll("[data-combobox-item]")
        ).some((item) => !(item as HTMLElement).hidden);

        if (index >= separators.length) return;

        const nextVisibleGroupExists = groups.slice(index + 1).some((nextGroup) =>
          Array.from(nextGroup.querySelectorAll("[data-combobox-item]")).some(
            (item) => !(item as HTMLElement).hidden
          )
        );

        separators[index].hidden = !(hasVisibleItems && nextVisibleGroupExists);
      });
    }

    function updateClearVisibility(hasSelection: boolean) {
      if (clearButton) {
        clearButton.classList.toggle("hidden", !hasSelection || isDisabled);
      }
      if (chevronIcon) {
        const shouldShowChevron = !isClearable || !hasSelection || isDisabled;
        chevronIcon.classList.toggle("hidden", !shouldShowChevron);
      }
    }

    function setSelectedValue(nextValue: string, emit = true) {
      let selectedLabel = "";

      items.forEach((item) => {
        const itemValue = item.getAttribute("data-value") || "";
        const isSelected = itemValue === nextValue;
        const indicator = item.querySelector(
          "[data-combobox-item-indicator]"
        ) as HTMLElement | null;

        if (isSelected) {
          selectedLabel = getItemLabel(item);
        }

        item.setAttribute("data-selected", isSelected ? "true" : "false");
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
        indicator?.classList.toggle("opacity-100", isSelected);
        indicator?.classList.toggle("opacity-0", !isSelected);
      });

      if (triggerLabel) {
        triggerLabel.textContent = selectedLabel || placeholder;
      }

      if (hiddenInput) {
        hiddenInput.value = nextValue;
      }

      combobox.setAttribute("data-combobox-value", nextValue);
      updateClearVisibility(Boolean(selectedLabel));

      if (emit) {
        combobox.dispatchEvent(
          new CustomEvent("combobox-change", {
            detail: {
              value: nextValue,
              label: selectedLabel || placeholder,
            },
            bubbles: true,
          })
        );
      }
    }

    function closePopover() {
      if (popoverContent) {
        popoverContent.hidden = true;
      }
      if (popoverTrigger) {
        popoverTrigger.setAttribute("aria-expanded", "false");
        popoverTrigger.focus();
      }
    }

    const initialValue = hiddenInput?.value
      ? hiddenInput.value
      : combobox.getAttribute("data-combobox-value") || "";
    setSelectedValue(initialValue, false);
    updateGroupSeparators();

    clearButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isDisabled) return;
      setSelectedValue("");
      if (searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        updateGroupSeparators();
      }
    });
    clearButton?.addEventListener("keydown", (event) => {
      const keyEvent = event as KeyboardEvent;
      if (keyEvent.key !== "Enter" && keyEvent.key !== " ") return;
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      if (isDisabled) return;
      setSelectedValue("");
      if (searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        updateGroupSeparators();
      }
    });

    if (isDisabled) {
      updateClearVisibility(Boolean(initialValue));
      return;
    }

    combobox.addEventListener("command-select", (event) => {
      const customEvent = event as CustomEvent<{ value?: string }>;
      const selectedValue = customEvent.detail?.value || "";

      if (!selectedValue) return;

      const selectedItem = items.find(
        (item) => (item.getAttribute("data-value") || "") === selectedValue
      );

      if (!selectedItem) return;
      if (selectedItem.getAttribute("aria-disabled") === "true") return;

      setSelectedValue(selectedValue);
      closePopover();
    });

    searchInput?.addEventListener("input", updateGroupSeparators);
  });
}
