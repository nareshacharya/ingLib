import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { FilterOption } from "../../constants/filterOptions";

interface FilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onSelectionChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const selectedCount = selectedValues.length;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="w-full inline-flex items-center justify-between gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-2.5 min-h-[42px]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {selectedCount > 0 ? (
              <span className="text-blue-600 font-medium truncate">
                {selectedCount === 1
                  ? selectedValues[0]
                  : `${selectedCount} selected`}
              </span>
            ) : (
              <span className="text-gray-700 truncate">{label}</span>
            )}
          </div>
          <svg
            className="h-4 w-4 flex-shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] max-w-[300px] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 text-gray-950 shadow-lg"
          sideOffset={5}
        >
          {/* Header with clear all */}
          {selectedCount > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {selectedCount} selected
              </div>
              <DropdownMenu.Item
                className="relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 text-red-600"
                onSelect={handleClearAll}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear all
              </DropdownMenu.Item>
              <div className="my-1 h-px bg-gray-200" />
            </>
          )}

          {/* Filter options */}
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                className="relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  handleToggleOption(option.value);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => {}} // Controlled by parent
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1 truncate">{option.label}</span>
                {option.count !== undefined && (
                  <span className="ml-2 text-xs text-gray-500 flex-shrink-0">
                    ({option.count})
                  </span>
                )}
              </DropdownMenu.Item>
            ))}
          </div>

          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
              No options available
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
