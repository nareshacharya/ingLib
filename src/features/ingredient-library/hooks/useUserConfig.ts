import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  UserConfigManager, 
  createUserConfigService, 
  getCurrentUserId 
} from '../services/userConfigService';
import type { UserPreferences } from '../services/userConfigService';
import type { 
  SortingState, 
  VisibilityState, 
  PaginationState, 
  RowSelectionState, 
  ColumnFiltersState, 
  GroupingState, 
  ExpandedState 
} from '@tanstack/react-table';

interface UseUserConfigOptions {
  storageType?: 'localStorage' | 'pega';
  apiBaseUrl?: string;
  autoSave?: boolean;
  saveDelay?: number;
}

interface UseUserConfigReturn {
  // State
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  savePreferences: () => Promise<void>;
  clearPreferences: () => Promise<void>;
  exportPreferences: () => Promise<string>;
  importPreferences: (configJson: string) => Promise<void>;
  
  // Table state helpers
  getTableState: () => {
    sorting: SortingState;
    columnVisibility: VisibilityState;
    pagination: PaginationState;
    rowSelection: RowSelectionState;
    globalFilter: string;
    columnFilters: ColumnFiltersState;
    grouping: GroupingState;
    expanded: ExpandedState;
  };
  
  updateTableState: (state: {
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
    pagination?: PaginationState;
    rowSelection?: RowSelectionState;
    globalFilter?: string;
    columnFilters?: ColumnFiltersState;
    grouping?: GroupingState;
    expanded?: ExpandedState;
  }) => Promise<void>;
  
  // UI state helpers
  getUIState: () => {
    showFilters: boolean;
    showColumnManager: boolean;
  };
  
  updateUIState: (state: {
    showFilters?: boolean;
    showColumnManager?: boolean;
  }) => Promise<void>;
}

export function useUserConfig(options: UseUserConfigOptions = {}): UseUserConfigReturn {
  const {
    storageType = 'localStorage',
    apiBaseUrl,
    autoSave = true,
    saveDelay = 1000,
  } = options;

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configManager, setConfigManager] = useState<UserConfigManager | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);

  // Initialize configuration manager
  useEffect(() => {
    const initializeConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userId = getCurrentUserId();
        const storageService = createUserConfigService(storageType, apiBaseUrl);
        const manager = new UserConfigManager(storageService, userId);
        
        await manager.initialize();
        setConfigManager(manager);
        setPreferences(manager.getPreferences());
        
        // User configuration initialized successfully
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize configuration';
        setError(errorMessage);
        console.error('Failed to initialize user configuration:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConfig();
  }, [storageType, apiBaseUrl]);


  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      const currentPrefs = configManager.getPreferences();
      if (!currentPrefs) {
        throw new Error('No current preferences found');
      }

      const newPreferences = { ...currentPrefs, ...updates };
      setPreferences(newPreferences);
      
      // Update the manager's internal state
      Object.entries(updates).forEach(([key, value]) => {
        configManager.updatePreference(key as keyof UserPreferences, value);
      });

      // Schedule auto-save if enabled
      if (autoSave && configManager) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(async () => {
          if (isSavingRef.current) return;
          isSavingRef.current = true;
          try {
            await configManager.savePreferences();
          } catch (err) {
            console.error('Failed to auto-save preferences:', err);
          } finally {
            isSavingRef.current = false;
          }
        }, saveDelay);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      throw err;
    }
  }, [configManager, autoSave, saveDelay]);

  // Save preferences immediately
  const savePreferences = useCallback(async () => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      await configManager.savePreferences();
      // Preferences saved successfully
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save preferences';
      setError(errorMessage);
      throw err;
    }
  }, [configManager]);

  // Clear preferences
  const clearPreferences = useCallback(async () => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      await configManager.clearPreferences();
      const defaultPrefs = configManager.getPreferences();
      setPreferences(defaultPrefs);
      // Preferences cleared successfully
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear preferences';
      setError(errorMessage);
      throw err;
    }
  }, [configManager]);

  // Export preferences
  const exportPreferences = useCallback(async (): Promise<string> => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      return await configManager.exportPreferences();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export preferences';
      setError(errorMessage);
      throw err;
    }
  }, [configManager]);

  // Import preferences
  const importPreferences = useCallback(async (configJson: string) => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      const importedPrefs = await configManager.importPreferences(configJson);
      setPreferences(importedPrefs);
      // Preferences imported successfully
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import preferences';
      setError(errorMessage);
      throw err;
    }
  }, [configManager]);

  // Get table state from preferences
  const getTableState = useCallback(() => {
    if (!preferences) {
      return {
        sorting: [],
        columnVisibility: {},
        pagination: { pageIndex: 0, pageSize: 10 },
        rowSelection: {},
        globalFilter: '',
        columnFilters: [],
        grouping: [],
        expanded: {},
      };
    }

    return {
      sorting: preferences.sorting,
      columnVisibility: preferences.columnVisibility,
      pagination: preferences.pagination,
      rowSelection: preferences.rowSelection,
      globalFilter: preferences.globalFilter,
      columnFilters: preferences.columnFilters,
      grouping: preferences.grouping,
      expanded: preferences.expandedRows,
    };
  }, [preferences]);

  // Update table state
  const updateTableState = useCallback(async (state: {
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
    pagination?: PaginationState;
    rowSelection?: RowSelectionState;
    globalFilter?: string;
    columnFilters?: ColumnFiltersState;
    grouping?: GroupingState;
    expanded?: ExpandedState;
  }) => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      const currentPrefs = configManager.getPreferences();
      if (!currentPrefs) {
        throw new Error('No current preferences found');
      }

      const updates: Partial<UserPreferences> = {};
      if (state.sorting !== undefined) updates.sorting = state.sorting;
      if (state.columnVisibility !== undefined) updates.columnVisibility = state.columnVisibility;
      if (state.pagination !== undefined) updates.pagination = state.pagination;
      if (state.rowSelection !== undefined) updates.rowSelection = state.rowSelection;
      if (state.globalFilter !== undefined) updates.globalFilter = state.globalFilter;
      if (state.columnFilters !== undefined) updates.columnFilters = state.columnFilters;
      if (state.grouping !== undefined) updates.grouping = state.grouping;
      if (state.expanded !== undefined) {
        updates.expandedRows = typeof state.expanded === 'boolean' ? {} : state.expanded;
      }

      const newPreferences = { ...currentPrefs, ...updates };
      setPreferences(newPreferences);
      
      // Update the manager's internal state
      Object.entries(updates).forEach(([key, value]) => {
        configManager.updatePreference(key as keyof UserPreferences, value);
      });

      // Schedule auto-save if enabled
      if (autoSave && configManager) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(async () => {
          if (isSavingRef.current) return;
          isSavingRef.current = true;
          try {
            await configManager.savePreferences();
          } catch (err) {
            console.error('Failed to auto-save preferences:', err);
          } finally {
            isSavingRef.current = false;
          }
        }, saveDelay);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update table state';
      setError(errorMessage);
      throw err;
    }
  }, [configManager, autoSave, saveDelay]);

  // Get UI state from preferences
  const getUIState = useCallback(() => {
    if (!preferences) {
      return {
        showFilters: false,
        showColumnManager: false,
      };
    }

    return {
      showFilters: preferences.showFilters,
      showColumnManager: preferences.showColumnManager,
    };
  }, [preferences]);

  // Update UI state
  const updateUIState = useCallback(async (state: {
    showFilters?: boolean;
    showColumnManager?: boolean;
  }) => {
    if (!configManager) {
      throw new Error('Configuration manager not initialized');
    }

    try {
      const currentPrefs = configManager.getPreferences();
      if (!currentPrefs) {
        throw new Error('No current preferences found');
      }

      const updates: Partial<UserPreferences> = {};
      if (state.showFilters !== undefined) updates.showFilters = state.showFilters;
      if (state.showColumnManager !== undefined) updates.showColumnManager = state.showColumnManager;

      const newPreferences = { ...currentPrefs, ...updates };
      setPreferences(newPreferences);
      
      // Update the manager's internal state
      Object.entries(updates).forEach(([key, value]) => {
        configManager.updatePreference(key as keyof UserPreferences, value);
      });

      // Schedule auto-save if enabled
      if (autoSave && configManager) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(async () => {
          if (isSavingRef.current) return;
          isSavingRef.current = true;
          try {
            await configManager.savePreferences();
          } catch (err) {
            console.error('Failed to auto-save preferences:', err);
          } finally {
            isSavingRef.current = false;
          }
        }, saveDelay);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update UI state';
      setError(errorMessage);
      throw err;
    }
  }, [configManager, autoSave, saveDelay]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    savePreferences,
    clearPreferences,
    exportPreferences,
    importPreferences,
    getTableState,
    updateTableState,
    getUIState,
    updateUIState,
  };
}
