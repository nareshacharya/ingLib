import type { TableConfig } from './tableConfig';

/**
 * Configuration Examples
 * 
 * This file shows how to easily modify table behavior by changing configuration values.
 * Simply copy the desired configuration and replace DEFAULT_TABLE_CONFIG in tableConfig.ts
 */

/**
 * Example 1: Enable Child Row Selection
 * Use this configuration to allow users to select child rows for comparison
 */
export const ENABLE_CHILD_SELECTION_CONFIG: Partial<TableConfig> = {
  selection: {
    enableRowSelection: true,
    enableChildRowSelection: true, // Enable child row selection
    enableMultiRowSelection: true,
    maxSelections: 10,
  },
};

/**
 * Example 2: Disable All Selection
 * Use this configuration to completely disable row selection
 */
export const DISABLE_SELECTION_CONFIG: Partial<TableConfig> = {
  selection: {
    enableRowSelection: false,
    enableChildRowSelection: false,
    enableMultiRowSelection: false,
    maxSelections: 0,
  },
};

/**
 * Example 3: Limited Selection (Only 3 items)
 * Use this configuration to limit comparison to 3 items
 */
export const LIMITED_SELECTION_CONFIG: Partial<TableConfig> = {
  selection: {
    enableRowSelection: true,
    enableChildRowSelection: false,
    enableMultiRowSelection: true,
    maxSelections: 3, // Limit to 3 selections
  },
};

/**
 * Example 4: Minimal Filters
 * Use this configuration to show only basic filters
 */
export const MINIMAL_FILTERS_CONFIG: Partial<TableConfig> = {
  filters: {
    enabled: true,
    availableAttributes: [
      {
        key: 'category',
        label: 'Category',
        type: 'multiselect',
        options: ['Essential Oils', 'Fragrance Compounds', 'Natural Extracts'],
        enabled: true,
      },
      {
        key: 'status',
        label: 'Status',
        type: 'multiselect',
        options: ['Active', 'Inactive', 'Discontinued'],
        enabled: true,
      },
      {
        key: 'name',
        label: 'Name Search',
        type: 'text',
        enabled: true,
      },
    ],
    defaultFilters: ['category', 'status'],
  },
};

/**
 * Example 5: Advanced Filters
 * Use this configuration to enable all available filters
 */
export const ADVANCED_FILTERS_CONFIG: Partial<TableConfig> = {
  filters: {
    enabled: true,
    availableAttributes: [
      {
        key: 'category',
        label: 'Category',
        type: 'multiselect',
        options: ['Essential Oils', 'Fragrance Compounds', 'Natural Extracts'],
        enabled: true,
      },
      {
        key: 'family',
        label: 'Family',
        type: 'multiselect',
        options: ['Citrus', 'Floral', 'Woody', 'Spicy', 'Herbal'],
        enabled: true,
      },
      {
        key: 'status',
        label: 'Status',
        type: 'multiselect',
        options: ['Active', 'Inactive', 'Discontinued'],
        enabled: true,
      },
      {
        key: 'type',
        label: 'Type',
        type: 'multiselect',
        options: ['Natural', 'Synthetic', 'Blend'],
        enabled: true,
      },
      {
        key: 'supplier',
        label: 'Supplier',
        type: 'multiselect',
        options: ['Givaudan', 'Firmenich', 'Symrise', 'IFF', 'Takasago'],
        enabled: true,
      },
      {
        key: 'costPerKg',
        label: 'Cost per Kg',
        type: 'range',
        min: 0,
        max: 1000,
        enabled: true,
      },
      {
        key: 'stock',
        label: 'Stock Level',
        type: 'range',
        min: 0,
        max: 1000,
        enabled: true,
      },
      {
        key: 'favorite',
        label: 'Favorites Only',
        type: 'boolean',
        enabled: true,
      },
      {
        key: 'name',
        label: 'Name Search',
        type: 'text',
        enabled: true,
      },
      {
        key: 'casNumber',
        label: 'CAS Number',
        type: 'text',
        enabled: true,
      },
      {
        key: 'ifraLimitPct',
        label: 'IFRA Limit %',
        type: 'range',
        min: 0,
        max: 100,
        enabled: true,
      },
    ],
    defaultFilters: ['category', 'family', 'status', 'type', 'supplier'],
  },
};

/**
 * Example 6: Disable All Features
 * Use this configuration for a read-only table
 */
export const READ_ONLY_CONFIG: Partial<TableConfig> = {
  selection: {
    enableRowSelection: false,
    enableChildRowSelection: false,
    enableMultiRowSelection: false,
    maxSelections: 0,
  },
  filters: {
    enabled: false,
    availableAttributes: [],
    defaultFilters: [],
  },
  columns: {
    enableColumnVisibility: false,
    enableColumnResizing: false,
    enableColumnPinning: false,
    enableColumnOrdering: false,
    defaultVisibleColumns: ['name', 'category', 'status', 'supplier', 'stock'],
  },
  sorting: {
    enabled: false,
    enableMultiColumnSorting: false,
  },
  pagination: {
    enabled: false,
    defaultPageSize: 1000,
    pageSizeOptions: [1000],
    enablePageSizeSelector: false,
  },
  expansion: {
    enabled: false,
    defaultExpandedRows: [],
    enableAutoExpand: false,
  },
  grouping: {
    enabled: false,
    availableGroupByOptions: [],
  },
  export: {
    enabled: false,
    availableFormats: [],
    enableBulkExport: false,
  },
  comparison: {
    enabled: false,
    maxComparableItems: 0,
    enableSideBySideComparison: false,
  },
};

/**
 * Example 7: Large Page Size
 * Use this configuration for tables that need to show more items per page
 */
export const LARGE_PAGE_CONFIG: Partial<TableConfig> = {
  pagination: {
    enabled: true,
    defaultPageSize: 100,
    pageSizeOptions: [25, 50, 100, 200],
    enablePageSizeSelector: true,
  },
};

/**
 * Example 8: Enable Excel Export
 * Use this configuration to enable Excel export functionality
 */
export const EXCEL_EXPORT_CONFIG: Partial<TableConfig> = {
  export: {
    enabled: true,
    availableFormats: [
      { key: 'csv', label: 'CSV', enabled: true },
      { key: 'json', label: 'JSON', enabled: true },
      { key: 'excel', label: 'Excel', enabled: true }, // Enable Excel export
    ],
    enableBulkExport: true,
  },
};

/**
 * How to Use These Configurations:
 * 
 * 1. Copy the desired configuration from this file
 * 2. In tableConfig.ts, replace DEFAULT_TABLE_CONFIG with your chosen configuration
 * 3. Or merge configurations: { ...DEFAULT_TABLE_CONFIG, ...ENABLE_CHILD_SELECTION_CONFIG }
 * 
 * Example:
 * export const DEFAULT_TABLE_CONFIG: TableConfig = {
 *   ...DEFAULT_TABLE_CONFIG,
 *   ...ENABLE_CHILD_SELECTION_CONFIG,
 * };
 */
