/**
 * UI Configuration Interface
 * Controls the visibility and behavior of UI components
 */
export interface UIConfig {
  // Header Configuration
  header: {
    showTitle: boolean;
    showDescription: boolean;
    title?: string;
    description?: string;
  };

  // Stats Cards Configuration
  stats: {
    enabled: boolean;
    showTotal: boolean;
    showActive: boolean;
    showFavorites: boolean;
    showLowStock: boolean;
    customStats?: Array<{
      id: string;
      label: string;
      color: string;
      getValue: (data: any[]) => number;
    }>;
  };

  // Toolbar Configuration
  toolbar: {
    enabled: boolean;
    showSearch: boolean;
    showFilters: boolean;
    showColumnManager: boolean;
    showExport: boolean;
    showCompare: boolean;
    showGrouping: boolean;
    customActions?: Array<{
      id: string;
      label: string;
      icon: string;
      onClick: () => void;
    }>;
  };

  // Pagination Configuration
  pagination: {
    enabled: boolean;
    showPageSizeSelector: boolean;
    showPageInfo: boolean;
    showNavigationButtons: boolean;
    pageSizeOptions: number[];
  };

  // Table Configuration
  table: {
    showHeader: boolean;
    showRowNumbers: boolean;
    enableRowHover: boolean;
    enableRowSelection: boolean;
    enableExpansion: boolean;
    enableSorting: boolean;
    enableColumnResizing: boolean;
    enableColumnReordering: boolean;
  };
}

/**
 * Default UI Configuration
 */
export const DEFAULT_UI_CONFIG: UIConfig = {
  header: {
    showTitle: true,
    showDescription: true,
    title: "Ingredient Library",
    description: "Manage your perfume ingredients with advanced filtering and hierarchical organization",
  },

  stats: {
    enabled: true,
    showTotal: true,
    showActive: true,
    showFavorites: true,
    showLowStock: true,
  },

  toolbar: {
    enabled: true,
    showSearch: true,
    showFilters: true,
    showColumnManager: true,
    showExport: true,
    showCompare: true,
    showGrouping: true,
  },

  pagination: {
    enabled: true,
    showPageSizeSelector: true,
    showPageInfo: true,
    showNavigationButtons: true,
    pageSizeOptions: [10, 25, 50, 100],
  },

  table: {
    showHeader: true,
    showRowNumbers: false,
    enableRowHover: true,
    enableRowSelection: true,
    enableExpansion: true,
    enableSorting: true,
    enableColumnResizing: true,
    enableColumnReordering: true,
  },
};

/**
 * Predefined UI Configurations
 */
export const UI_CONFIG_PRESETS = {
  // Minimal configuration - only essential features
  MINIMAL: {
    ...DEFAULT_UI_CONFIG,
    header: {
      ...DEFAULT_UI_CONFIG.header,
      showDescription: false,
    },
    stats: {
      ...DEFAULT_UI_CONFIG.stats,
      enabled: false,
    },
    toolbar: {
      ...DEFAULT_UI_CONFIG.toolbar,
      showFilters: false,
      showColumnManager: false,
      showExport: false,
      showCompare: false,
      showGrouping: false,
    },
    pagination: {
      ...DEFAULT_UI_CONFIG.pagination,
      showPageSizeSelector: false,
      showPageInfo: false,
    },
  },

  // Full featured configuration
  FULL_FEATURED: DEFAULT_UI_CONFIG,

  // Read-only configuration
  READ_ONLY: {
    ...DEFAULT_UI_CONFIG,
    toolbar: {
      ...DEFAULT_UI_CONFIG.toolbar,
      showExport: false,
      showCompare: false,
    },
    table: {
      ...DEFAULT_UI_CONFIG.table,
      enableRowSelection: false,
      enableExpansion: false,
      enableSorting: false,
      enableColumnResizing: false,
      enableColumnReordering: false,
    },
  },

  // Mobile optimized configuration
  MOBILE: {
    ...DEFAULT_UI_CONFIG,
    stats: {
      ...DEFAULT_UI_CONFIG.stats,
      enabled: false,
    },
    toolbar: {
      ...DEFAULT_UI_CONFIG.toolbar,
      showColumnManager: false,
      showGrouping: false,
    },
    pagination: {
      ...DEFAULT_UI_CONFIG.pagination,
      showPageSizeSelector: false,
    },
  },
};

/**
 * Helper functions for UI configuration
 */
export class UIConfigHelper {
  /**
   * Check if a UI component should be rendered
   */
  static shouldShowComponent(config: UIConfig, component: keyof UIConfig): boolean {
    const componentConfig = config[component];
    if (typeof componentConfig === 'object' && 'enabled' in componentConfig) {
      return componentConfig.enabled as boolean;
    }
    return true;
  }

  /**
   * Get header configuration
   */
  static getHeaderConfig(config: UIConfig) {
    return config.header;
  }

  /**
   * Get stats configuration
   */
  static getStatsConfig(config: UIConfig) {
    return config.stats;
  }

  /**
   * Get toolbar configuration
   */
  static getToolbarConfig(config: UIConfig) {
    return config.toolbar;
  }

  /**
   * Get pagination configuration
   */
  static getPaginationConfig(config: UIConfig) {
    return config.pagination;
  }

  /**
   * Get table configuration
   */
  static getTableConfig(config: UIConfig) {
    return config.table;
  }

  /**
   * Merge configurations
   */
  static mergeConfigs(base: UIConfig, override: Partial<UIConfig>): UIConfig {
    return {
      ...base,
      ...override,
      header: { ...base.header, ...override.header },
      stats: { ...base.stats, ...override.stats },
      toolbar: { ...base.toolbar, ...override.toolbar },
      pagination: { ...base.pagination, ...override.pagination },
      table: { ...base.table, ...override.table },
    };
  }
}
