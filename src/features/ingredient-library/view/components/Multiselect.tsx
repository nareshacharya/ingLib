import { useState, useRef, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { dropdownStyles } from "../../styles";

export interface MultiselectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiselectProps {
  options: MultiselectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxDisplayCount?: number;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Multiselect({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  maxDisplayCount = 2,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: MultiselectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option toggle
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle select all
  const handleSelectAll = () => {
    const allValues = filteredOptions
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.value);
    onChange(allValues);
  };

  // Handle clear all
  const handleClearAll = () => {
    onChange([]);
  };

  // Get display text for trigger
  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder;
    }

    if (value.length <= maxDisplayCount) {
      return value
        .map((v) => options.find((opt) => opt.value === v)?.label || v)
        .join(", ");
    }

    return `${value.length} selected`;
  };

  // Focus search input when opened
  useEffect(() => {
    if (open && searchInputRef.current) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open]);

  // Clear search when closed
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger
        className={`${dropdownStyles.trigger} ${className}`}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <span className="flex-1 text-left truncate">{getDisplayText()}</span>
        <span className="flex-shrink-0 text-gray-400">{open ? "▲" : "▼"}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`${dropdownStyles.content} min-w-[200px] max-w-[300px]`}
          align="start"
          sideOffset={4}
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => {
                // Prevent dropdown from closing when typing
                e.stopPropagation();
              }}
            />
          </div>

          {/* Select/Clear all buttons */}
          {filteredOptions.length > 0 && (
            <div className="flex gap-1 p-2 border-b border-gray-200">
              <button
                onClick={handleSelectAll}
                className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchTerm ? "No options found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);

                return (
                  <DropdownMenu.Item
                    key={option.value}
                    className={`${dropdownStyles.item} ${
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={option.disabled}
                    onSelect={(e) => {
                      e.preventDefault(); // Prevent dropdown from closing
                      if (!option.disabled) {
                        handleToggle(option.value);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (!option.disabled) {
                            handleToggle(option.value);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={option.disabled}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                    </div>
                  </DropdownMenu.Item>
                );
              })
            )}
          </div>

          {/* Selection summary */}
          {value.length > 0 && (
            <div className="p-2 border-t border-gray-200 text-xs text-gray-500">
              {value.length} of {options.length} selected
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Text input for search/text filters
export interface FilterTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function FilterTextInput({
  value,
  onChange,
  placeholder = "Enter text...",
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: FilterTextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`rounded-lg border-0 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2.5 min-w-[120px] ${className}`}
      aria-label={ariaLabel}
    />
  );
}

// Switch for boolean filters
export interface FilterSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function FilterSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: FilterSwitchProps) {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

// Range input for numeric filters
export interface FilterRangeProps {
  value: { min?: number; max?: number };
  onChange: (value: { min?: number; max?: number }) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function FilterRange({
  value = {},
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: FilterRangeProps) {
  const handleMinChange = (newMin: string) => {
    const minVal = newMin === "" ? undefined : Number(newMin);
    onChange({ ...value, min: minVal });
  };

  const handleMaxChange = (newMax: string) => {
    const maxVal = newMax === "" ? undefined : Number(newMax);
    onChange({ ...value, max: maxVal });
  };

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={ariaLabel}
    >
      <input
        type="number"
        value={value.min ?? ""}
        onChange={(e) => handleMinChange(e.target.value)}
        placeholder={String(min)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-20 rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <span className="text-gray-500 text-sm">to</span>
      <input
        type="number"
        value={value.max ?? ""}
        onChange={(e) => handleMaxChange(e.target.value)}
        placeholder={String(max)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-20 rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}
