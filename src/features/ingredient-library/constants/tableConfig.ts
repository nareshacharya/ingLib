// Removed unused import

/**
 * Table Configuration Interface
 * Defines all configurable features for the ingredient library table
 */
export interface TableConfig {
  // Selection Configuration
  selection: {
    enableRowSelection: boolean;
    enableChildRowSelection: boolean;
    enableMultiRowSelection: boolean;
    maxSelections?: number;
  };

  // Filter Configuration
  filters: {
    enabled: boolean;
    availableAttributes: FilterAttribute[];
    defaultFilters: string[];
  };

  // Column Configuration
  columns: {
    enableColumnVisibility: boolean;
    enableColumnResizing: boolean;
    enableColumnPinning: boolean;
    enableColumnOrdering: boolean;
    defaultVisibleColumns: string[];
  };

  // Sorting Configuration
  sorting: {
    enabled: boolean;
    enableMultiColumnSorting: boolean;
    defaultSortColumn?: string;
    defaultSortDirection?: 'asc' | 'desc';
  };

  // Pagination Configuration
  pagination: {
    enabled: boolean;
    defaultPageSize: number;
    pageSizeOptions: number[];
    enablePageSizeSelector: boolean;
  };

  // Expansion Configuration
  expansion: {
    enabled: boolean;
    defaultExpandedRows: string[];
    enableAutoExpand: boolean;
  };

  // Grouping Configuration
  grouping: {
    enabled: boolean;
    availableGroupByOptions: string[];
    defaultGroupBy?: string;
  };

  // Export Configuration
  export: {
    enabled: boolean;
    availableFormats: ExportFormat[];
    enableBulkExport: boolean;
  };

  // Comparison Configuration
  comparison: {
    enabled: boolean;
    maxComparableItems: number;
    enableSideBySideComparison: boolean;
  };
}

/**
 * Filter Attribute Configuration
 */
export interface FilterAttribute {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
  options?: string[]; // For select/multiselect types
  min?: number; // For range type
  max?: number; // For range type
  enabled: boolean;
}

/**
 * Export Format Configuration
 */
export interface ExportFormat {
  key: string;
  label: string;
  enabled: boolean;
}

/**
 * Default Table Configuration
 * This is the current configuration - modify these values to change behavior
 */
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  // Selection Configuration
  selection: {
    enableRowSelection: true,
    enableChildRowSelection: false, // Disabled for now - can be enabled later
    enableMultiRowSelection: true,
    maxSelections: 10, // Limit for comparison
  },

  // Filter Configuration
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
    ],
    defaultFilters: ['category', 'status', 'type', 'supplier'],
  },

  // Column Configuration
  columns: {
    enableColumnVisibility: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    enableColumnOrdering: true,
    defaultVisibleColumns: [
      'select',
      'expander',
      'name',
      'category',
      'family',
      'status',
      'type',
      'supplier',
      'costPerKg',
      'stock',
      'favorite',
    ],
  },

  // Sorting Configuration
  sorting: {
    enabled: true,
    enableMultiColumnSorting: true,
    defaultSortColumn: 'name',
    defaultSortDirection: 'asc',
  },

  // Pagination Configuration
  pagination: {
    enabled: true,
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    enablePageSizeSelector: true,
  },

  // Expansion Configuration
  expansion: {
    enabled: true,
    defaultExpandedRows: [],
    enableAutoExpand: false,
  },

  // Grouping Configuration
  grouping: {
    enabled: true,
    availableGroupByOptions: ['category', 'family', 'supplier', 'status'],
    defaultGroupBy: undefined, // No default grouping
  },

  // Export Configuration
  export: {
    enabled: true,
    availableFormats: [
      { key: 'csv', label: 'CSV', enabled: true },
      { key: 'json', label: 'JSON', enabled: true },
      { key: 'excel', label: 'Excel', enabled: false }, // Can be enabled later
    ],
    enableBulkExport: true,
  },

  // Comparison Configuration
  comparison: {
    enabled: true,
    maxComparableItems: 5,
    enableSideBySideComparison: true,
  },
};

/**
 * Helper function to get enabled filter attributes
 */
export function getEnabledFilterAttributes(config: TableConfig): FilterAttribute[] {
  return config.filters.availableAttributes.filter(attr => attr.enabled);
}

/**
 * Helper function to get enabled export formats
 */
export function getEnabledExportFormats(config: TableConfig): ExportFormat[] {
  return config.export.availableFormats.filter(format => format.enabled);
}

/**
 * Helper function to check if a feature is enabled
 */
export function isFeatureEnabled(config: TableConfig, feature: keyof TableConfig): boolean {
  const featureConfig = config[feature];
  return typeof featureConfig === 'object' && 'enabled' in featureConfig 
    ? (featureConfig as { enabled: boolean }).enabled 
    : true;
}

/**
 * Helper function to get selection configuration
 */
export function getSelectionConfig(config: TableConfig) {
  return config.selection;
}

/**
 * Helper function to get filter configuration
 */
export function getFilterConfig(config: TableConfig) {
  return config.filters;
}
