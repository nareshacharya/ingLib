import type { MasterConfig } from '../constants/configManager';

export type UserPreferences = {
  // Table state
  columnVisibility: Record<string, boolean>;
  sorting: Array<{ id: string; desc: boolean }>;
  pagination: { pageIndex: number; pageSize: number };
  rowSelection: Record<string, boolean>;
  
  // Filters
  globalFilter: string;
  columnFilters: Array<{ id: string; value: unknown }>;
  grouping: string[];
  
  // UI state
  showFilters: boolean;
  showColumnManager: boolean;
  expandedRows: Record<string, boolean>;
  
  // User-specific table configuration
  customTableConfig?: Partial<MasterConfig['table']>;
  
  // Timestamp for cache invalidation
  lastUpdated: string;
  version: string;
};

export type UserConfigStorage = {
  savePreferences(userId: string, preferences: UserPreferences): Promise<void>;
  loadPreferences(userId: string): Promise<UserPreferences | null>;
  clearPreferences(userId: string): Promise<void>;
  exportPreferences(userId: string): Promise<string>;
  importPreferences(userId: string, configJson: string): Promise<UserPreferences>;
};

/**
 * LocalStorage-based implementation for user configuration persistence
 * This can be easily replaced with API-based storage for Pega integration
 */
export class LocalStorageUserConfigService implements UserConfigStorage {
  private readonly STORAGE_KEY_PREFIX = 'ingredient-library-user-config';
  private readonly CURRENT_VERSION = '1.0.0';

  private getStorageKey(userId: string): string {
    return `${this.STORAGE_KEY_PREFIX}-${userId}`;
  }

  async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      const configWithVersion = {
        ...preferences,
        version: this.CURRENT_VERSION,
        lastUpdated: new Date().toISOString(),
      };

      const storageKey = this.getStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(configWithVersion));
      
      // User preferences saved successfully
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      throw new Error('Failed to save user preferences');
    }
  }

  async loadPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const storageKey = this.getStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) {
        return null;
      }

      const preferences = JSON.parse(stored) as UserPreferences;
      
      // Validate and migrate if needed
      const migratedPreferences = this.migratePreferences(preferences);
      
      // User preferences loaded successfully
      return migratedPreferences;
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return null;
    }
  }

  async clearPreferences(userId: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(userId);
      localStorage.removeItem(storageKey);
      // User preferences cleared successfully
    } catch (error) {
      console.error('Failed to clear user preferences:', error);
      throw new Error('Failed to clear user preferences');
    }
  }

  async exportPreferences(userId: string): Promise<string> {
    const preferences = await this.loadPreferences(userId);
    if (!preferences) {
      throw new Error('No preferences found to export');
    }
    return JSON.stringify(preferences, null, 2);
  }

  async importPreferences(userId: string, configJson: string): Promise<UserPreferences> {
    try {
      const preferences = JSON.parse(configJson) as UserPreferences;
      const migratedPreferences = this.migratePreferences(preferences);
      
      await this.savePreferences(userId, migratedPreferences);
      return migratedPreferences;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      throw new Error('Invalid configuration format');
    }
  }

  private migratePreferences(preferences: UserPreferences): UserPreferences {
    // Handle version migrations here
    if (!preferences.version || preferences.version !== this.CURRENT_VERSION) {
      // Migrating preferences to current version
      
      // Add migration logic here for future versions
      // For now, just ensure all required fields exist
      return {
        columnVisibility: preferences.columnVisibility || {},
        sorting: preferences.sorting || [],
        pagination: preferences.pagination || { pageIndex: 0, pageSize: 10 },
        rowSelection: preferences.rowSelection || {},
        globalFilter: preferences.globalFilter || '',
        columnFilters: preferences.columnFilters || [],
        grouping: preferences.grouping || [],
        showFilters: preferences.showFilters || false,
        showColumnManager: preferences.showColumnManager || false,
        expandedRows: preferences.expandedRows || {},
        customTableConfig: preferences.customTableConfig,
        lastUpdated: preferences.lastUpdated || new Date().toISOString(),
        version: this.CURRENT_VERSION,
      };
    }
    
    return preferences;
  }
}

/**
 * API-based implementation for Pega integration
 * This would connect to Pega's user preference storage
 */
export class PegaUserConfigService implements UserConfigStorage {
  private readonly API_BASE_URL: string;
  private readonly CURRENT_VERSION = '1.0.0';

  constructor(apiBaseUrl: string) {
    this.API_BASE_URL = apiBaseUrl;
  }

  async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      const configWithVersion = {
        ...preferences,
        version: this.CURRENT_VERSION,
        lastUpdated: new Date().toISOString(),
      };

      const response = await fetch(`${this.API_BASE_URL}/user-preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configWithVersion),
      });

      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.statusText}`);
      }

      // User preferences saved to Pega successfully
    } catch (error) {
      console.error('Failed to save user preferences to Pega:', error);
      throw new Error('Failed to save user preferences');
    }
  }

  async loadPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/user-preferences/${userId}`);
      
      if (response.status === 404) {
        return null; // No preferences found
      }

      if (!response.ok) {
        throw new Error(`Failed to load preferences: ${response.statusText}`);
      }

      const preferences = await response.json() as UserPreferences;
      // User preferences loaded from Pega successfully
      return preferences;
    } catch (error) {
      console.error('Failed to load user preferences from Pega:', error);
      return null;
    }
  }

  async clearPreferences(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/user-preferences/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to clear preferences: ${response.statusText}`);
      }

      // User preferences cleared from Pega successfully
    } catch (error) {
      console.error('Failed to clear user preferences from Pega:', error);
      throw new Error('Failed to clear user preferences');
    }
  }

  async exportPreferences(userId: string): Promise<string> {
    const preferences = await this.loadPreferences(userId);
    if (!preferences) {
      throw new Error('No preferences found to export');
    }
    return JSON.stringify(preferences, null, 2);
  }

  async importPreferences(userId: string, configJson: string): Promise<UserPreferences> {
    try {
      const preferences = JSON.parse(configJson) as UserPreferences;
      await this.savePreferences(userId, preferences);
      return preferences;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      throw new Error('Invalid configuration format');
    }
  }
}

/**
 * User Configuration Manager
 * Handles all user-specific configuration operations
 */
export class UserConfigManager {
  private storageService: UserConfigStorage;
  private currentUserId: string;
  private preferences: UserPreferences | null = null;

  constructor(storageService: UserConfigStorage, userId: string) {
    this.storageService = storageService;
    this.currentUserId = userId;
  }

  /**
   * Initialize user configuration
   * Loads saved preferences or creates default ones
   */
  async initialize(): Promise<UserPreferences> {
    try {
      this.preferences = await this.storageService.loadPreferences(this.currentUserId);
      
      if (!this.preferences) {
        this.preferences = this.getDefaultPreferences();
        await this.savePreferences();
      }

      return this.preferences;
    } catch (error) {
      console.error('Failed to initialize user configuration:', error);
      this.preferences = this.getDefaultPreferences();
      return this.preferences;
    }
  }

  /**
   * Save current preferences
   */
  async savePreferences(): Promise<void> {
    if (!this.preferences) {
      throw new Error('No preferences to save');
    }

    await this.storageService.savePreferences(this.currentUserId, this.preferences);
  }

  /**
   * Update specific preference and save
   */
  async updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<void> {
    if (!this.preferences) {
      this.preferences = this.getDefaultPreferences();
    }

    this.preferences[key] = value;
    await this.savePreferences();
  }

  /**
   * Get current preferences
   */
  getPreferences(): UserPreferences | null {
    return this.preferences;
  }

  /**
   * Clear all preferences
   */
  async clearPreferences(): Promise<void> {
    await this.storageService.clearPreferences(this.currentUserId);
    this.preferences = this.getDefaultPreferences();
  }

  /**
   * Export preferences as JSON
   */
  async exportPreferences(): Promise<string> {
    return await this.storageService.exportPreferences(this.currentUserId);
  }

  /**
   * Import preferences from JSON
   */
  async importPreferences(configJson: string): Promise<UserPreferences> {
    this.preferences = await this.storageService.importPreferences(this.currentUserId, configJson);
    return this.preferences;
  }

  /**
   * Get default preferences for new users
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      columnVisibility: {
        expander: true,
        select: true,
        favorite: true,
        ingredientId: true,
        name: true,
        category: true,
        status: true,
        type: true,
        supplier: true,
        costPerKg: true,
        stock: true,
      },
      sorting: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      rowSelection: {},
      globalFilter: '',
      columnFilters: [],
      grouping: [],
      showFilters: false,
      showColumnManager: false,
      expandedRows: {},
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Check if preferences have been modified since last save
   */
  isModified(): boolean {
    // This could be enhanced to track dirty state
    return false;
  }

  /**
   * Get user ID
   */
  getUserId(): string {
    return this.currentUserId;
  }
}

/**
 * Factory function to create appropriate storage service
 */
export function createUserConfigService(
  storageType: 'localStorage' | 'pega' = 'localStorage',
  apiBaseUrl?: string
): UserConfigStorage {
  switch (storageType) {
    case 'localStorage':
      return new LocalStorageUserConfigService();
    case 'pega':
      if (!apiBaseUrl) {
        throw new Error('API base URL is required for Pega storage');
      }
      return new PegaUserConfigService(apiBaseUrl);
    default:
      throw new Error(`Unknown storage type: ${storageType}`);
  }
}

/**
 * Hook for getting current user ID
 * This should be integrated with your authentication system
 */
export function getCurrentUserId(): string {
  // In a real Pega application, this would come from the authentication context
  // For now, we'll use a simple approach
  const userId = localStorage.getItem('current-user-id');
  
  if (!userId) {
    // Generate a temporary user ID for demo purposes
    const tempUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('current-user-id', tempUserId);
    return tempUserId;
  }
  
  return userId;
}
