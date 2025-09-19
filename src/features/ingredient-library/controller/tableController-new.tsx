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

// Column helper for creating column definitions
const columnHelper = createColumnHelper<Ingredient>();

// Create reusable column definitions based on configuration
const createColumnDef = (config: ColumnConfig): ColumnDef<Ingredient> => {
  const { key, visible, width } = config;

  // Base column configuration
  const baseConfig: Partial<ColumnDef<Ingredient>> = {
    id: key,
    size: width,
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
    meta: {
      headerClassName: "text-left font-medium",
    },
  };

  // Define accessors and cell renderers based on column key
  switch (key) {
    case "select":
      return {
        ...baseConfig,
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      } as ColumnDef<Ingredient>;

    case "favorite":
      return columnHelper.accessor("favorite", {
        ...baseConfig,
        header: "★",
        cell: ({ getValue }) => (
          <span className={getValue() ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ),
      });

    case "name":
      return columnHelper.accessor("name", {
        ...baseConfig,
        header: "Name",
        cell: ({ getValue }) => (
          <div className="font-medium text-gray-900">{getValue()}</div>
        ),
      });

    case "category":
      return columnHelper.accessor("category", {
        ...baseConfig,
        header: "Category",
        cell: ({ getValue }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getValue()}
          </span>
        ),
      });

    case "family":
      return columnHelper.accessor("family", {
        ...baseConfig,
        header: "Family",
      });

    case "status":
      return columnHelper.accessor("status", {
        ...baseConfig,
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue();
          const colorClass =
            value === "Active"
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-100";
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
            >
              {value}
            </span>
          );
        },
      });

    case "type":
      return columnHelper.accessor("type", {
        ...baseConfig,
        header: "Type",
        cell: ({ getValue }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {getValue()}
          </span>
        ),
      });

    case "supplier":
      return columnHelper.accessor("supplier", {
        ...baseConfig,
        header: "Supplier",
      });

    case "costPerKg":
      return columnHelper.accessor("costPerKg", {
        ...baseConfig,
        header: "Cost/kg",
        cell: ({ getValue }) => {
          const value = getValue();
          return `$${value.toFixed(2)}`;
        },
      });

    case "stock":
      return columnHelper.accessor("stock", {
        ...baseConfig,
        header: "Stock",
        cell: ({ getValue }) => getValue()?.toLocaleString() ?? "0",
      });

    case "casNumber":
      return columnHelper.accessor("casNumber", {
        ...baseConfig,
        header: "CAS Number",
        cell: ({ getValue }) => getValue() ?? "N/A",
      });

    case "ifraLimitPct":
      return columnHelper.accessor("ifraLimitPct", {
        ...baseConfig,
        header: "IFRA Limit %",
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? `${value}%` : "N/A";
        },
      });

    case "allergens":
      return columnHelper.accessor("allergens", {
        ...baseConfig,
        header: "Allergens",
        cell: ({ getValue }) => {
          const allergens = getValue();
          if (!allergens || allergens.length === 0) return "None";

          return (
            <div className="flex flex-wrap gap-1">
              {allergens.slice(0, 2).map((allergen) => (
                <span
                  key={allergen}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"
                >
                  {allergen}
                </span>
              ))}
              {allergens.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{allergens.length - 2} more
                </span>
              )}
            </div>
          );
        },
      });

    case "updatedAt":
      return columnHelper.accessor("updatedAt", {
        ...baseConfig,
        header: "Updated",
        cell: ({ getValue }) => {
          const value = getValue();
          return new Date(value).toLocaleDateString();
        },
      });

    case "actions":
      return {
        ...baseConfig,
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
            <button className="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      } as ColumnDef<Ingredient>;

    default:
      // Fallback for unknown keys
      return {
        ...baseConfig,
        header: key,
        accessorKey: key,
        cell: ({ getValue }) => String(getValue() ?? ""),
      } as ColumnDef<Ingredient>;
  }
};

export const useIngredientTableController = (
  options: UseIngredientTableControllerOptions
): IngredientTableController => {
  const { dataSource, initialPageSize = 50 } = options;

  // Core state
  const [data, setData] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View management state
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [currentViewId, setCurrentViewId] = useState<string | undefined>();

  // Table state
  const [query, setQuery] = useState("");
  const [filters, setFiltersState] = useState<FiltersState>(
    createEmptyFiltersState()
  );
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [groupBy, setGroupByState] = useState<GroupKey | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Initialize data and views
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);

        // Load data
        const ingredientData = await dataSource.getIngredients();
        setData(ingredientData);

        // Load saved views
        const views = await viewStore.getAllViews();
        setSavedViews(views);

        // Load last used view or default
        const lastUsed = await viewStore.getLastUsedView();
        if (lastUsed) {
          await loadViewInternal(lastUsed.id);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [dataSource]);

  // Update column visibility based on column config
  useEffect(() => {
    const visibility: VisibilityState = {};
    columns.forEach((col) => {
      visibility[col.key] = col.visible;
    });
    setColumnVisibility(visibility);
  }, [columns]);

  // Update grouping based on groupBy setting
  useEffect(() => {
    setGrouping(groupBy ? [groupBy] : []);
  }, [groupBy]);

  // Debounced query for better performance
  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), 300),
    []
  );

  // Apply filters to get filtered data
  const filteredData = useMemo(() => {
    return applyFilters(data, { query, filters, groupBy, sortBy: null });
  }, [data, query, filters, groupBy]);

  // Calculate stats from filtered data
  const stats = useMemo(() => {
    return calculateStats(filteredData);
  }, [filteredData]);

  // Generate filter definitions with current data options
  const filterDefs = useMemo(() => {
    return getFilterDefsWithOptions(data);
  }, [data]);

  // Generate active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: Array<{
      id: string;
      label: string;
      value: string;
      removable: boolean;
    }> = [];

    // Query chip
    if (query) {
      chips.push({
        id: "query",
        label: "Search",
        value: query,
        removable: true,
      });
    }

    // Filter chips
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const filterDef = DEFAULT_FILTERS.find((f) => f.key === key);
      if (!filterDef) return;

      if (filterDef.type === "multiselect" && Array.isArray(value)) {
        if (value.length > 0) {
          chips.push({
            id: key,
            label: filterDef.label,
            value: value.length === 1 ? value[0] : `${value.length} selected`,
            removable: true,
          });
        }
      } else if (
        filterDef.type === "range" &&
        typeof value === "object" &&
        value !== null
      ) {
        const range = value as { min?: number; max?: number };
        if (range.min !== undefined || range.max !== undefined) {
          const rangeText =
            range.min !== undefined && range.max !== undefined
              ? `${range.min} - ${range.max}`
              : range.min !== undefined
              ? `≥ ${range.min}`
              : `≤ ${range.max}`;
          chips.push({
            id: key,
            label: filterDef.label,
            value: rangeText,
            removable: true,
          });
        }
      } else if (filterDef.type === "boolean" && typeof value === "boolean") {
        chips.push({
          id: key,
          label: filterDef.label,
          value: value ? "Yes" : "No",
          removable: true,
        });
      }
    });

    // Group by chip
    if (groupBy) {
      chips.push({
        id: "groupBy",
        label: "Grouped by",
        value: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
        removable: true,
      });
    }

    return chips;
  }, [query, filters, groupBy]);

  // Create column definitions from config
  const columnDefs = useMemo(() => {
    return columns.sort((a, b) => a.order - b.order).map(createColumnDef);
  }, [columns]);

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns: columnDefs,
    state: {
      sorting,
      columnVisibility,
      expanded,
      grouping,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => row.id,
    debugTable: process.env.NODE_ENV === "development",
  });

  // Check if current state has unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!currentViewId) return false;

    const currentView = savedViews.find((v) => v.id === currentViewId);
    if (!currentView) return false;

    const currentState = {
      query,
      filters,
      columns,
      groupBy,
      sortBy: sorting.length > 0 ? sorting[0] : null,
    };

    return isViewModified(currentView, currentState);
  }, [currentViewId, savedViews, query, filters, columns, groupBy, sorting]);

  // Load view internal helper
  const loadViewInternal = async (viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId);
    if (!view) return;

    setQuery(view.query);
    setFiltersState(view.filters);
    setColumns(view.columns);
    setGroupByState(view.groupBy);

    if (view.sortBy) {
      setSorting([
        {
          id: view.sortBy.column,
          desc: view.sortBy.direction === "desc",
        },
      ]);
    } else {
      setSorting([]);
    }

    setCurrentViewId(viewId);
    await viewStore.setLastUsedView(viewId);
  };

  // Actions - Core
  const setFilters = useCallback((newFilters: Partial<FiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setFiltersState(createEmptyFiltersState());
    setGroupByState(null);
    setSorting([]);
  }, []);

  const setGroupBy = useCallback((newGroupBy: GroupKey) => {
    setGroupByState((prev) => (prev === newGroupBy ? null : newGroupBy));
  }, []);

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
    table.toggleAllRowsSelected();
  }, [table]);

  // Actions - Views
  const loadView = useCallback(
    async (viewId: string) => {
      await loadViewInternal(viewId);
    },
    [savedViews]
  );

  const saveCurrentAsView = useCallback(
    async (name: string) => {
      const currentState = {
        query,
        filters,
        columns,
        groupBy,
        sortBy: sorting.length > 0 ? sorting[0] : null,
      };

      const newView = createDefaultView(name, currentState);
      const savedView = await viewStore.saveView(newView);

      setSavedViews(await viewStore.getAllViews());
      setCurrentViewId(savedView.id);
    },
    [query, filters, columns, groupBy, sorting]
  );

  const updateCurrentView = useCallback(async () => {
    if (!currentViewId) return;

    const currentState = {
      query,
      filters,
      columns,
      groupBy,
      sortBy: sorting.length > 0 ? sorting[0] : null,
    };

    await viewStore.updateView(currentViewId, currentState);
    setSavedViews(await viewStore.getAllViews());
  }, [currentViewId, query, filters, columns, groupBy, sorting]);

  const deleteView = useCallback(
    async (viewId: string) => {
      await viewStore.deleteView(viewId);
      setSavedViews(await viewStore.getAllViews());

      if (currentViewId === viewId) {
        setCurrentViewId(undefined);
      }
    },
    [currentViewId]
  );

  const setDefaultView = useCallback(async (viewId: string) => {
    await viewStore.setDefaultView(viewId);
    setSavedViews(await viewStore.getAllViews());
  }, []);

  const renameView = useCallback(async (viewId: string, newName: string) => {
    await viewStore.updateView(viewId, { name: newName });
    setSavedViews(await viewStore.getAllViews());
  }, []);

  // Actions - Columns
  const setColumnVisibility = useCallback(
    (key: ColumnDefKey, visible: boolean) => {
      setColumns((prev) =>
        prev.map((col) => (col.key === key ? { ...col, visible } : col))
      );
    },
    []
  );

  const setColumnWidth = useCallback((key: ColumnDefKey, width: number) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, width } : col))
    );
  }, []);

  const moveColumn = useCallback((key: ColumnDefKey, newIndex: number) => {
    setColumns((prev) => {
      const updated = [...prev];
      const currentIndex = updated.findIndex((col) => col.key === key);

      if (currentIndex === -1) return prev;

      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(newIndex, 0, moved);

      // Update order values
      return updated.map((col, index) => ({ ...col, order: index }));
    });
  }, []);

  const resetColumns = useCallback(() => {
    setColumns(DEFAULT_COLUMNS);
  }, []);

  const setColumnsConfig = useCallback((newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
  }, []);

  // Actions - Grouping
  const setExpandedGroups = useCallback(
    (expandedGroups: Record<string, boolean>) => {
      setExpanded(expandedGroups);
    },
    []
  );

  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setExpanded((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  // Utility values
  const selectedRows = useMemo(() => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [table, rowSelection]);

  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  // Refresh function
  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const ingredientData = await dataSource.getIngredients();
      setData(ingredientData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  // Current table state for external access
  const state: TableState = useMemo(
    () => ({
      query,
      filters,
      columns,
      groupBy,
      sortBy:
        sorting.length > 0
          ? {
              column: sorting[0].id as ColumnDefKey,
              direction: sorting[0].desc ? "desc" : "asc",
            }
          : null,
      selection: rowSelection,
      pagination: {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      expanded,
    }),
    [
      query,
      filters,
      columns,
      groupBy,
      sorting,
      rowSelection,
      pagination,
      expanded,
    ]
  );

  return {
    // Table instance
    table,

    // Data
    data,
    filteredData,
    stats,
    isLoading,
    error,

    // State
    state,

    // Saved Views
    savedViews,
    currentViewId,
    hasUnsavedChanges,

    // Filter System
    filterDefs,
    activeFilterChips,

    // Actions - Core
    setQuery: debouncedSetQuery,
    setFilters,
    clearFilters,
    setGroupBy,
    setSelection,
    toggleRowSelection,
    toggleAllRowsSelection,

    // Actions - Views
    loadView,
    saveCurrentAsView,
    updateCurrentView,
    deleteView,
    setDefaultView,
    renameView,

    // Actions - Columns
    setColumnVisibility,
    setColumnWidth,
    moveColumn,
    resetColumns,
    setColumnsConfig,

    // Actions - Grouping
    setExpandedGroups,
    toggleGroupExpansion,

    // Utility
    selectedRows,
    selectedCount,
    hasSelection,

    // Refresh
    refetch,
  };
};
