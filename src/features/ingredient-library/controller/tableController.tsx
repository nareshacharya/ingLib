import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
  type GroupingState,
} from "@tanstack/react-table";
import type {
  Ingredient,
  TableState,
  StatsData,
  SavedView,
  FiltersState,
  ColumnConfig,
  GroupKey,
  SortSpec,
  ColumnDefKey,
} from "../model/types";
import type { IDataSource } from "../services/dataSource";
import {
  viewStore,
  DEFAULT_COLUMNS,
  createDefaultView,
  isViewModified,
} from "../services/viewStore";
import {
  applyFilters,
  getFilterDefsWithOptions,
  createEmptyFiltersState,
  DEFAULT_FILTERS,
} from "./filterBuilder";
import { calculateStats, debounce } from "./selectors";
import { Icon } from "../theme/icons";

export interface UseIngredientTableControllerOptions {
  dataSource: IDataSource;
  initialPageSize?: number;
}

export interface IngredientTableController {
  // Table instance
  table: ReturnType<typeof useReactTable<Ingredient>>;

  // Data
  data: Ingredient[];
  filteredData: Ingredient[];
  stats: StatsData;
  isLoading: boolean;
  error: string | null;

  // State
  state: TableState;

  // Saved Views
  savedViews: SavedView[];
  currentViewId?: string;
  hasUnsavedChanges: boolean;

  // Filter System
  filterDefs: ReturnType<typeof getFilterDefsWithOptions>;
  activeFilterChips: Array<{
    id: string;
    label: string;
    value: string;
    removable: boolean;
  }>;

  // Actions - Core
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<FiltersState>) => void;
  clearFilters: () => void;
  setGroupBy: (groupBy: GroupKey) => void;
  setSelection: (selection: Record<string, boolean>) => void;
  toggleRowSelection: (rowId: string) => void;
  toggleAllRowsSelection: () => void;

  // Actions - Views
  loadView: (viewId: string) => void;
  saveCurrentAsView: (name: string) => void;
  updateCurrentView: () => void;
  deleteView: (viewId: string) => void;
  setDefaultView: (viewId: string) => void;
  renameView: (viewId: string, newName: string) => void;

  // Actions - Columns
  setColumnVisibility: (key: ColumnDefKey, visible: boolean) => void;
  setColumnWidth: (key: ColumnDefKey, width: number) => void;
  moveColumn: (key: ColumnDefKey, newIndex: number) => void;
  resetColumns: () => void;
  setColumnsConfig: (columns: ColumnConfig[]) => void;

  // Actions - Grouping
  setExpandedGroups: (expanded: Record<string, boolean>) => void;
  toggleGroupExpansion: (groupKey: string) => void;

  // Utility
  selectedRows: Ingredient[];
  selectedCount: number;
  hasSelection: boolean;

  // Refresh
  refetch: () => Promise<void>;
}

const columnHelper = createColumnHelper<Ingredient>();

export function useIngredientTableController({
  dataSource,
  initialPageSize = 25,
}: UseIngredientTableControllerOptions): IngredientTableController {
  // State
  const [data, setData] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Saved Views
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [currentViewId, setCurrentViewId] = useState<string | undefined>();

  // Table state
  const [query, setQuery] = useState("");
  const [filters, setFiltersState] = useState<FiltersState>(
    createEmptyFiltersState()
  );
  const [groupBy, setGroupBy] = useState<GroupKey>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnConfig, setColumnConfig] =
    useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    // Demo: Pre-select first 2 items for testing actions
    "ing-001": true,
    "ing-002": true,
  });

  // Debounced search
  const debouncedSetQuery = useMemo(
    () =>
      debounce((searchQuery: string) => {
        setFiltersState((prev) => ({ ...prev, search: searchQuery }));
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  // Load saved views
  const loadSavedViews = useCallback(async () => {
    const result = await viewStore.listViews();
    if (result.success && result.data) {
      setSavedViews(result.data);
    }
  }, []);

  // Initialize saved views
  useEffect(() => {
    loadSavedViews();
  }, [loadSavedViews]);

  // Filter definitions with dynamic options
  const filterDefs = useMemo(() => getFilterDefsWithOptions(data), [data]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return applyFilters(data, filterDefs, filters);
  }, [data, filterDefs, filters]);

  // Group data if groupBy is set (simplified to avoid infinite loops)
  const groupedData = useMemo(() => {
    if (!groupBy) return filteredData;
    // For now, just return filteredData to avoid complex grouping issues
    return filteredData;
  }, [filteredData, groupBy]);

  // Actions
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      try {
        const result = await dataSource.toggleFavorite(id);
        if (result.success) {
          setData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, favorite: !item.favorite } : item
            )
          );
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    },
    [dataSource]
  );

  // Columns definition with dynamic visibility and order
  const columns = useMemo<ColumnDef<Ingredient>[]>(() => {
    const visibleColumns = columnConfig
      .filter((col) => col.visible)
      .sort((a, b) => a.order - b.order);

    return visibleColumns.map((colConfig) => {
      const { key, width } = colConfig;

      switch (key) {
        case "select":
          return {
            id: "select",
            header: ({ table }) => (
              <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
              />
            ),
            cell: ({ row }) => {
              if ((row.original as any).isGroupHeader) {
                return (
                  <button
                    onClick={() =>
                      toggleGroupExpansion((row.original as any).groupKey)
                    }
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    {expandedGroups[(row.original as any).groupKey] ? "▼" : "▶"}
                  </button>
                );
              }
              return (
                <input
                  type="checkbox"
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                />
              );
            },
            enableSorting: false,
            enableHiding: false,
            size: width || 40,
          };

        case "favorite":
          return {
            accessorKey: "favorite",
            header: "Favorite",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;

              const isFavorite = getValue() as boolean;
              return (
                <button
                  onClick={() => handleToggleFavorite(row.original.id)}
                  className={`p-1 transition-colors focus:outline-none rounded border-0 bg-transparent !bg-transparent hover:bg-transparent active:bg-transparent ${
                    isFavorite ? "!text-yellow-500" : "!text-gray-300"
                  } hover:!text-yellow-500`}
                  style={{
                    backgroundColor: "transparent !important",
                    color: isFavorite ? "#eab308" : "#d1d5db",
                    border: "none",
                  }}
                >
                  {isFavorite ? "★" : "☆"}
                </button>
              );
            },
            enableSorting: true,
            size: width || 80,
          };

        case "name":
          return {
            accessorKey: "name",
            header: "Name",
            cell: ({ row, getValue }) => {
              const value = getValue() as string;
              const level = (row.original as any).level || 0;
              const isGroupHeader = (row.original as any).isGroupHeader;
              const hasChildren = row.getCanExpand();

              if (isGroupHeader) {
                const groupKey = (row.original as any).groupKey;
                const isExpanded = expandedGroups[groupKey];
                const groupItems = filteredData.filter(
                  (item) => item[groupBy!] === groupKey
                );

                return (
                  <div className="flex items-center gap-2 font-semibold text-gray-900 bg-gray-50 py-1">
                    <button
                      onClick={() => toggleGroupExpansion(groupKey)}
                      className="p-1 hover:bg-gray-200 rounded flex items-center justify-center"
                    >
                      <Icon
                        name={isExpanded ? "chevronDown" : "chevronRight"}
                        size="sm"
                      />
                    </button>
                    <span>{value}</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                      {groupItems.length} items
                    </span>
                  </div>
                );
              }

              return (
                <div
                  className={`flex items-center ${
                    level > 0 ? `pl-${level * 4}` : ""
                  }`}
                >
                  {hasChildren && (
                    <button
                      onClick={row.getToggleExpandedHandler()}
                      className="mr-2 p-1 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Icon
                        name={
                          row.getIsExpanded() ? "chevronDown" : "chevronRight"
                        }
                        size="sm"
                      />
                    </button>
                  )}
                  <span className="font-medium">{value}</span>
                </div>
              );
            },
            enableSorting: true,
            size: width || 200,
          };

        case "category":
          return {
            accessorKey: "category",
            header: "Category",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;
              return getValue();
            },
            enableSorting: true,
            size: width || 150,
          };

        case "family":
          return {
            accessorKey: "family",
            header: "Family",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;
              return getValue();
            },
            enableSorting: true,
            size: width || 120,
          };

        case "status":
          return {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;

              const status = getValue() as string;
              const className =
                status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800";
              return (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
                >
                  {status}
                </span>
              );
            },
            enableSorting: true,
            size: width || 100,
          };

        case "type":
          return {
            accessorKey: "type",
            header: "Type",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;

              const type = getValue() as string;
              const className =
                type === "Natural"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-800";
              return (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
                >
                  {type}
                </span>
              );
            },
            enableSorting: true,
            size: width || 100,
          };

        case "supplier":
          return {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;
              return getValue();
            },
            enableSorting: true,
            size: width || 120,
          };

        case "costPerKg":
          return {
            accessorKey: "costPerKg",
            header: "Cost/kg",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;

              const value = getValue() as number;
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(value);
            },
            enableSorting: true,
            size: width || 100,
          };

        case "stock":
          return {
            accessorKey: "stock",
            header: "Stock",
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;

              const stock = getValue() as number;
              let className = "bg-green-100 text-green-800";

              if (stock === 0) className = "bg-red-100 text-red-800";
              else if (stock < 50) className = "bg-orange-100 text-orange-800";
              else if (stock < 150) className = "bg-yellow-100 text-yellow-800";

              return (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
                  >
                    {stock} kg
                  </span>
                </div>
              );
            },
            enableSorting: true,
            size: width || 100,
          };

        case "actions":
          return {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
              if ((row.original as any).isGroupHeader) return null;
              return (
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  ⋮
                </button>
              );
            },
            enableSorting: false,
            enableHiding: false,
            size: width || 60,
          };

        default:
          return {
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1),
            cell: ({ getValue, row }) => {
              if ((row.original as any).isGroupHeader) return null;
              return String(getValue() || "");
            },
            enableSorting: true,
            size: width || 120,
          };
      }
    });
  }, [
    columnConfig,
    handleToggleFavorite,
    expandedGroups,
    filteredData,
    groupBy,
  ]);

  // Data fetching
  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setIsLoading(true);
        }
        setError(null);

        const result = await dataSource.list({
          filters: filters as any, // Legacy compatibility
          sortBy: sorting.map((sort) => ({ id: sort.id, desc: sort.desc })),
          pagination,
        });

        if (result.success && result.data) {
          setData(result.data);
          if (!isInitialized) {
            setIsInitialized(true);
          }
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [dataSource, filters, sorting, pagination, isInitialized]
  );

  // Initial load and load default view
  useEffect(() => {
    if (!isInitialized) {
      fetchData(true).then(async () => {
        // Load default view or last used view
        const lastUsedResult = await viewStore.getLastUsedView();
        if (lastUsedResult.success && lastUsedResult.data) {
          const view = savedViews.find((v) => v.id === lastUsedResult.data);
          if (view) {
            loadView(view.id);
            return;
          }
        }

        const defaultResult = await viewStore.getDefaultView();
        if (defaultResult.success && defaultResult.data) {
          loadView(defaultResult.data.id);
        }
      });
    }
  }, [isInitialized, savedViews]);

  // Subsequent filter/sort/pagination changes
  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        fetchData(false); // Don't show loading spinner for filter changes
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, sorting, pagination, isInitialized]);

  // Action implementations
  const setFilters = useCallback((newFilters: Partial<FiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setFiltersState(createEmptyFiltersState());
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // View actions
  const loadView = useCallback(
    async (viewId: string) => {
      // Get the most recent saved views directly
      const currentViews = await viewStore.listViews();
      if (!currentViews.success || !currentViews.data) return;

      const view = currentViews.data.find((v) => v.id === viewId);
      if (!view) return;

      setQuery(view.query);
      setFiltersState(view.filters);
      setColumnConfig(view.columns);
      setGroupBy(view.groupBy || null);
      setSorting(view.sortBy ? [view.sortBy] : []);
      setCurrentViewId(viewId);

      // Set as last used
      await viewStore.setLastUsedView(viewId);
    },
    [] // Remove savedViews dependency to prevent infinite loops
  );

  const saveCurrentAsView = useCallback(
    async (name: string) => {
      const result = await viewStore.createView({
        name,
        query,
        filters,
        columns: columnConfig,
        groupBy,
        sortBy: sorting.length > 0 ? sorting[0] : null,
      });

      if (result.success && result.data) {
        setSavedViews((prev) => [...prev, result.data!]);
        setCurrentViewId(result.data.id);
      }
    },
    [query, filters, columnConfig, groupBy, sorting]
  );

  const updateCurrentView = useCallback(async () => {
    if (!currentViewId) return;

    // Get current views directly to avoid dependency issues
    const currentViews = await viewStore.listViews();
    if (!currentViews.success || !currentViews.data) return;

    const currentView = currentViews.data.find((v) => v.id === currentViewId);
    if (!currentView) return;

    const updatedView: SavedView = {
      ...currentView,
      query,
      filters,
      columns: columnConfig,
      groupBy,
      sortBy: sorting.length > 0 ? sorting[0] : null,
    };

    const result = await viewStore.updateView(updatedView);
    if (result.success && result.data) {
      setSavedViews((prev) =>
        prev.map((v) => (v.id === currentViewId ? result.data! : v))
      );
    }
  }, [currentViewId, query, filters, columnConfig, groupBy, sorting]);

  const deleteView = useCallback(
    async (viewId: string) => {
      const result = await viewStore.deleteView(viewId);
      if (result.success) {
        setSavedViews((prev) => prev.filter((v) => v.id !== viewId));
        if (currentViewId === viewId) {
          setCurrentViewId(undefined);
        }
      }
    },
    [currentViewId]
  );

  const setDefaultView = useCallback(async (viewId: string) => {
    const result = await viewStore.setDefaultView(viewId);
    if (result.success) {
      setSavedViews((prev) =>
        prev.map((v) => ({ ...v, isDefault: v.id === viewId }))
      );
    }
  }, []);

  const renameView = useCallback(
    async (viewId: string, newName: string) => {
      // Get current views directly to avoid dependency issues
      const currentViews = await viewStore.listViews();
      if (!currentViews.success || !currentViews.data) return;

      const view = currentViews.data.find((v) => v.id === viewId);
      if (!view) return;

      const updatedView: SavedView = { ...view, name: newName };
      const result = await viewStore.updateView(updatedView);
      if (result.success && result.data) {
        setSavedViews((prev) =>
          prev.map((v) => (v.id === viewId ? result.data! : v))
        );
      }
    },
    [] // Remove savedViews dependency
  );

  // Column actions
  const setColumnVisibilityAction = useCallback(
    (key: ColumnDefKey, visible: boolean) => {
      setColumnConfig((prev) =>
        prev.map((col) => (col.key === key ? { ...col, visible } : col))
      );
    },
    []
  );

  const setColumnWidth = useCallback((key: ColumnDefKey, width: number) => {
    setColumnConfig((prev) =>
      prev.map((col) => (col.key === key ? { ...col, width } : col))
    );
  }, []);

  const moveColumn = useCallback((key: ColumnDefKey, newIndex: number) => {
    setColumnConfig((prev) => {
      const currentIndex = prev.findIndex((col) => col.key === key);
      if (currentIndex === -1) return prev;

      const newConfig = [...prev];
      const [movedCol] = newConfig.splice(currentIndex, 1);
      newConfig.splice(newIndex, 0, movedCol);

      return newConfig.map((col, index) => ({ ...col, order: index }));
    });
  }, []);

  const resetColumns = useCallback(() => {
    setColumnConfig([...DEFAULT_COLUMNS]);
  }, []);

  const setColumnsConfig = useCallback((columns: ColumnConfig[]) => {
    setColumnConfig(columns);
  }, []);

  // Group actions
  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  // Selection actions
  const setSelection = useCallback((selection: Record<string, boolean>) => {
    setRowSelection(selection);
  }, []);

  const toggleRowSelection = useCallback((rowId: string) => {
    setRowSelection((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  }, []);

  const toggleAllRowsSelection = useCallback(() => {
    const allSelected = filteredData.every((row) => rowSelection[row.id]);
    if (allSelected) {
      setRowSelection({});
    } else {
      const newSelection: Record<string, boolean> = {};
      filteredData.forEach((row) => {
        newSelection[row.id] = true;
      });
      setRowSelection(newSelection);
    }
  }, [filteredData, rowSelection]);

  // Determine final data to use in table (simplified)
  const finalData = useMemo(() => {
    return filteredData; // Use simple filteredData to avoid grouping complexity
  }, [filteredData]);

  // Update column visibility state for react-table
  useEffect(() => {
    const visibility: VisibilityState = {};
    columnConfig.forEach((col) => {
      visibility[col.key] = col.visible;
    });
    setColumnVisibility(visibility);
  }, [columnConfig]);

  // Table instance
  const table = useReactTable({
    data: finalData,
    columns,
    state: {
      sorting,
      columnVisibility,
      expanded,
      pagination,
      rowSelection,
      grouping: groupBy ? [groupBy] : [],
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.subRows,
  });

  // Derived state
  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);
  const selectedRows = useMemo(
    () => filteredData.filter((row) => rowSelection[row.id]),
    [filteredData, rowSelection]
  );
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  // Check if current state differs from saved view
  const hasUnsavedChanges = useMemo(() => {
    if (!currentViewId) return false;
    const currentView = savedViews.find((v) => v.id === currentViewId);
    if (!currentView) return false;

    // Simple comparison to avoid complex object comparisons that might cause loops
    return (
      query !== currentView.query ||
      groupBy !== currentView.groupBy ||
      JSON.stringify(filters) !== JSON.stringify(currentView.filters) ||
      JSON.stringify(columnConfig) !== JSON.stringify(currentView.columns)
    );
  }, [currentViewId, savedViews, query, filters, columnConfig, groupBy]);

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: Array<{
      id: string;
      label: string;
      value: string;
      removable: boolean;
    }> = [];

    if (query.trim()) {
      chips.push({
        id: "search",
        label: "Search",
        value: `"${query}"`,
        removable: true,
      });
    }

    // Add other filter chips based on filter state
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "search") return; // Already handled above

      if (Array.isArray(value) && value.length > 0) {
        value.forEach((item) => {
          chips.push({
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(item),
            removable: true,
          });
        });
      } else if (typeof value === "boolean" && value === true) {
        chips.push({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: "On",
          removable: true,
        });
      }
    });

    return chips;
  }, [query, filters]);

  const state: TableState = {
    query,
    filters,
    groupBy,
    sortBy: sorting.map((s) => ({ id: s.id, desc: s.desc })),
    selection: rowSelection,
    pagination,
    columnVisibility,
    columnConfig,
    expanded: expanded as Record<string, boolean>,
    expandedGroups,
  };

  return {
    table,
    data,
    filteredData,
    stats,
    isLoading,
    error,
    state,
    savedViews,
    currentViewId,
    hasUnsavedChanges,
    filterDefs,
    activeFilterChips,
    setQuery,
    setFilters,
    clearFilters,
    setGroupBy,
    setSelection,
    toggleRowSelection,
    toggleAllRowsSelection,
    loadView,
    saveCurrentAsView,
    updateCurrentView,
    deleteView,
    setDefaultView,
    renameView,
    setColumnVisibility: setColumnVisibilityAction,
    setColumnWidth,
    moveColumn,
    resetColumns,
    setColumnsConfig,
    setExpandedGroups,
    toggleGroupExpansion,
    selectedRows,
    selectedCount,
    hasSelection,
    refetch: () => fetchData(true),
  };
}
