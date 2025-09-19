import React from "react";
import type {
  IngredientFilters,
  IngredientStatus,
  IngredientType,
  StockLevel,
} from "../../model/types";
import { toolbarStyles } from "../../styles";
import { FilterDropdown } from "./FilterDropdown";
import {
  categoryOptions,
  statusOptions,
  typeOptions,
  supplierOptions,
  stockLevelOptions,
} from "../../constants/filterOptions";

interface ToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: IngredientFilters;
  onFiltersChange: (filters: Partial<IngredientFilters>) => void;
  onClearFilters: () => void;
  selectedCount: number;
  onCompareSelected?: () => void;
  onExportSelected?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  onClearFilters,
  selectedCount,
  onCompareSelected,
  onExportSelected,
}) => {
  return (
    <div className={toolbarStyles.root}>
      {/* Search Section */}
      <div className={toolbarStyles.searchContainer}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={`${toolbarStyles.searchInput} pl-10`}
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <FilterDropdown
          label="Category"
          options={categoryOptions}
          selectedValues={filters.categories}
          onSelectionChange={(values) =>
            onFiltersChange({ categories: values })
          }
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          }
        />

        {/* Status Filter */}
        <FilterDropdown
          label="Status"
          options={statusOptions}
          selectedValues={filters.statuses}
          onSelectionChange={(values) =>
            onFiltersChange({ statuses: values as IngredientStatus[] })
          }
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        {/* Type Filter */}
        <FilterDropdown
          label="Type"
          options={typeOptions}
          selectedValues={filters.types}
          onSelectionChange={(values) =>
            onFiltersChange({ types: values as IngredientType[] })
          }
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          }
        />

        {/* Supplier Filter */}
        <FilterDropdown
          label="Supplier"
          options={supplierOptions}
          selectedValues={filters.suppliers}
          onSelectionChange={(values) => onFiltersChange({ suppliers: values })}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        {/* Stock Level Filter */}
        <FilterDropdown
          label="Stock Level"
          options={stockLevelOptions}
          selectedValues={filters.stockLevels}
          onSelectionChange={(values) =>
            onFiltersChange({ stockLevels: values as StockLevel[] })
          }
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        {/* Favorites toggle */}
        <button
          onClick={() =>
            onFiltersChange({ favoritesOnly: !filters.favoritesOnly })
          }
          className={toolbarStyles.toggleButton}
          data-active={filters.favoritesOnly}
        >
          <svg
            className="w-4 h-4"
            fill={filters.favoritesOnly ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          Favorites
        </button>

        {/* Clear filters */}
        {(query ||
          filters.categories.length > 0 ||
          filters.statuses.length > 0 ||
          filters.types.length > 0 ||
          filters.suppliers.length > 0 ||
          filters.stockLevels.length > 0 ||
          filters.favoritesOnly) && (
          <button onClick={onClearFilters} className={toolbarStyles.button}>
            <svg
              className="w-4 h-4"
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
            Clear Filters
          </button>
        )}
      </div>

      {/* Actions Row - Only show when items are selected */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">
            {selectedCount} selected
          </span>

          <div className="flex items-center gap-3">
            {selectedCount >= 2 && selectedCount <= 5 && onCompareSelected && (
              <button
                onClick={onCompareSelected}
                className={toolbarStyles.buttonPrimary}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
                Compare Selected
              </button>
            )}

            {onExportSelected && (
              <button
                onClick={onExportSelected}
                className={toolbarStyles.button}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
