import type { TableConfig } from './tableConfig';
import { DEFAULT_UI_CONFIG, UI_CONFIG_PRESETS } from './uiConfig';
import type { UIConfig } from './uiConfig';
import type { FilterConfig } from './filterConfig';

/**
 * Master Configuration Interface
 * Combines all configuration aspects into a single interface
 */
export interface MasterConfig {
  // Core configurations
  table: TableConfig;
  ui: UIConfig;
  filters: FilterConfig[];
  
  // Data source configuration
  dataSource: {
    type: 'local' | 'api' | 'custom';
    apiUrl?: string;
    apiKey?: string;
    customDataSource?: any;
    refreshInterval?: number; // Auto-refresh interval in milliseconds
  };
  
  // Feature flags
  features: {
    enableGrouping: boolean;
    enableComparison: boolean;
    enableExport: boolean;
    enableSavedViews: boolean;
    enableRealTimeUpdates: boolean;
    enableOfflineMode: boolean;
  };
  
  // Performance settings
  performance: {
    enableVirtualization: boolean;
    virtualScrollThreshold: number; // Number of rows before virtualization kicks in
    debounceSearchMs: number;
    enableMemoization: boolean;
    maxConcurrentRequests: number;
  };
  
  // Customization
  customization: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    numberFormat: string;
    currency: string;
  };
}

/**
 * Default Master Configuration
 */
export const DEFAULT_MASTER_CONFIG: MasterConfig = {
  table: {
    selection: {
      enableRowSelection: true,
      enableChildRowSelection: false,
      enableMultiRowSelection: true,
      maxSelections: 10,
    },
    filters: {
      enabled: true,
      availableAttributes: [],
      defaultFilters: [],
    },
    columns: {
      enableColumnVisibility: true,
      enableColumnResizing: true,
      enableColumnPinning: true,
      enableColumnOrdering: true,
      defaultVisibleColumns: [],
    },
    sorting: {
      enabled: true,
      enableMultiColumnSorting: true,
    },
    pagination: {
      enabled: true,
      defaultPageSize: 25,
      pageSizeOptions: [10, 25, 50, 100],
      enablePageSizeSelector: true,
    },
    expansion: {
      enabled: true,
      defaultExpandedRows: [],
      enableAutoExpand: false,
    },
    grouping: {
      enabled: true,
      availableGroupByOptions: [],
    },
    export: {
      enabled: true,
      availableFormats: [
        { key: 'csv', label: 'CSV', enabled: true },
        { key: 'json', label: 'JSON', enabled: true }
      ],
      enableBulkExport: true,
    },
    comparison: {
      enabled: true,
      maxComparableItems: 5,
      enableSideBySideComparison: true,
    },
  },
  
  ui: DEFAULT_UI_CONFIG,
  
  filters: [],
  
  dataSource: {
    type: 'local',
    refreshInterval: 0, // No auto-refresh by default
  },
  
  features: {
    enableGrouping: true,
    enableComparison: true,
    enableExport: true,
    enableSavedViews: false,
    enableRealTimeUpdates: false,
    enableOfflineMode: false,
  },
  
  performance: {
    enableVirtualization: true,
    virtualScrollThreshold: 1000,
    debounceSearchMs: 300,
    enableMemoization: true,
    maxConcurrentRequests: 5,
  },
  
  customization: {
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    currency: 'USD',
  },
};

/**
 * Predefined Configuration Presets
 */
export const CONFIG_PRESETS = {
  // Minimal configuration for basic tables
  MINIMAL: {
    ...DEFAULT_MASTER_CONFIG,
    ui: UI_CONFIG_PRESETS.MINIMAL,
    features: {
      ...DEFAULT_MASTER_CONFIG.features,
      enableGrouping: false,
      enableComparison: false,
      enableExport: false,
    },
  },
  
  // Full-featured configuration
  FULL_FEATURED: DEFAULT_MASTER_CONFIG,
  
  // Read-only configuration
  READ_ONLY: {
    ...DEFAULT_MASTER_CONFIG,
    ui: UI_CONFIG_PRESETS.READ_ONLY,
    features: {
      ...DEFAULT_MASTER_CONFIG.features,
      enableExport: false,
      enableComparison: false,
    },
  },
  
  // Mobile-optimized configuration
  MOBILE: {
    ...DEFAULT_MASTER_CONFIG,
    ui: UI_CONFIG_PRESETS.MOBILE,
    performance: {
      ...DEFAULT_MASTER_CONFIG.performance,
      virtualScrollThreshold: 100, // Lower threshold for mobile
    },
  },
  
  // API-connected configuration
  API_CONNECTED: {
    ...DEFAULT_MASTER_CONFIG,
    dataSource: {
      ...DEFAULT_MASTER_CONFIG.dataSource,
      type: 'api' as const,
      refreshInterval: 30000, // 30 seconds
    },
    features: {
      ...DEFAULT_MASTER_CONFIG.features,
      enableRealTimeUpdates: true,
    },
  },
};

/**
 * Configuration Manager Class
 * Provides utilities for managing and validating configurations
 */
export class ConfigManager {
  private config: MasterConfig;
  
  constructor(config: MasterConfig = DEFAULT_MASTER_CONFIG) {
    this.config = config;
  }
  
  /**
   * Get the current configuration
   */
  getConfig(): MasterConfig {
    return this.config;
  }
  
  /**
   * Update the configuration
   */
  updateConfig(updates: Partial<MasterConfig>): void {
    this.config = this.mergeConfigs(this.config, updates);
  }
  
  /**
   * Apply a preset configuration
   */
  applyPreset(presetName: keyof typeof CONFIG_PRESETS): void {
    this.config = CONFIG_PRESETS[presetName];
  }
  
  /**
   * Merge configurations deeply
   */
  private mergeConfigs(base: MasterConfig, override: Partial<MasterConfig>): MasterConfig {
    return {
      ...base,
      ...override,
      table: { ...base.table, ...override.table },
      ui: { ...base.ui, ...override.ui },
      dataSource: { ...base.dataSource, ...override.dataSource },
      features: { ...base.features, ...override.features },
      performance: { ...base.performance, ...override.performance },
      customization: { ...base.customization, ...override.customization },
    };
  }
  
  /**
   * Validate configuration
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate table configuration
    if (this.config.table.pagination.defaultPageSize <= 0) {
      errors.push('Default page size must be greater than 0');
    }
    
    if (this.config.table.selection.maxSelections && this.config.table.selection.maxSelections <= 0) {
      errors.push('Max selections must be greater than 0');
    }
    
    // Validate data source configuration
    if (this.config.dataSource.type === 'api' && !this.config.dataSource.apiUrl) {
      errors.push('API URL is required when using API data source');
    }
    
    // Validate performance settings
    if (this.config.performance.debounceSearchMs < 0) {
      errors.push('Debounce search time must be non-negative');
    }
    
    if (this.config.performance.virtualScrollThreshold < 0) {
      errors.push('Virtual scroll threshold must be non-negative');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Export configuration to JSON
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }
  
  /**
   * Import configuration from JSON
   */
  importConfig(configJson: string): { success: boolean; error?: string } {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...DEFAULT_MASTER_CONFIG, ...importedConfig };
      
      const validation = this.validateConfig();
      if (!validation.isValid) {
        return {
          success: false,
          error: `Configuration validation failed: ${validation.errors.join(', ')}`,
        };
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    this.config = DEFAULT_MASTER_CONFIG;
  }
  
  /**
   * Get configuration for a specific component
   */
  getComponentConfig(component: keyof UIConfig) {
    return this.config.ui[component];
  }
  
  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof MasterConfig['features']): boolean {
    return this.config.features[feature];
  }
  
  /**
   * Get data source configuration
   */
  getDataSourceConfig() {
    return this.config.dataSource;
  }
  
  /**
   * Get performance configuration
   */
  getPerformanceConfig() {
    return this.config.performance;
  }
}
