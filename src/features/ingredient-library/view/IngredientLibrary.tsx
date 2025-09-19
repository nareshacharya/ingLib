import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
  type ColumnFiltersState,
  type GroupingState,
} from "@tanstack/react-table";
import { LocalDataSource } from "../services/localDataSource";
import type { Ingredient } from "../model/types";
import { AdvancedTableController } from "../controller/advancedTableController";
import { FILTER_CONFIG } from "../constants/filterConfig";
import { getSelectionConfig, getFilterConfig } from "../constants/tableConfig";
import { DEFAULT_MASTER_CONFIG, ConfigManager, type MasterConfig } from "../constants/configManager";
import { UIConfigHelper } from "../constants/uiConfig";
import { CompareDialog } from "./components/CompareDialog";
import { ConfigPage } from "./components/ConfigPage";

// Initialize data source - can be configured dynamically
const dataSource = new LocalDataSource();

export const IngredientLibrary: React.FC = () => {
  // Configuration management
  const [configManager] = useState(() => new ConfigManager(DEFAULT_MASTER_CONFIG));
  const [masterConfig, setMasterConfig] = useState<MasterConfig>(configManager.getConfig());
  const [showConfigPage, setShowConfigPage] = useState(false);
  
  // Table configuration - now from master config
  const tableConfig = masterConfig.table;
  const selectionConfig = getSelectionConfig(tableConfig);
  const tableFilterConfig = getFilterConfig(tableConfig);
  const uiConfig = masterConfig.ui;

  // Data state
  const [data, setData] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    expander: true, // Force expander column to be visible
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: tableConfig.pagination.defaultPageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [grouping, setGrouping] = useState<GroupingState>([]);

  // UI state
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Configuration handlers
  const handleConfigChange = useCallback((newConfig: MasterConfig) => {
    configManager.updateConfig(newConfig);
    setMasterConfig(newConfig);
  }, [configManager]);

  const handleConfigSave = useCallback((newConfig: MasterConfig) => {
    // Save configuration to localStorage or API
    localStorage.setItem('ingredient-library-config', JSON.stringify(newConfig));
    setShowConfigPage(false);
  }, []);

  const handleConfigCancel = useCallback(() => {
    setShowConfigPage(false);
  }, []);

  // Custom row selection handler that respects configuration
  const handleRowSelectionChange = useCallback((updater: ((prev: RowSelectionState) => RowSelectionState) | RowSelectionState) => {
    setRowSelection((prevSelection) => {
      // If child row selection is disabled, we need to handle select all specially
      if (!selectionConfig.enableChildRowSelection) {
        // Get only parent rows (non-child rows)
        const parentRows = data.filter(item => !item.parentId);
        
        // Handle select all case - if the updater is a function, it might be select all
        if (typeof updater === 'function') {
          // Test the updater with an empty state to see if it would select all
          const testResult = updater({});
          
          // If it's selecting all (selects all parent rows), select only parent rows
          if (typeof testResult === 'object' && Object.keys(testResult).length === parentRows.length) {
            const allParentSelection: RowSelectionState = {};
            parentRows.forEach(row => {
              allParentSelection[row.id] = true;
            });
            return allParentSelection;
          }
          
          // If it's deselecting all, return empty object
          if (typeof testResult === 'object' && Object.keys(testResult).length === 0) {
            return {};
          }
        }
        
        // For individual selections, filter out child rows
        const newSelection = typeof updater === 'function' ? updater(prevSelection) : updater;
        const filteredSelection: RowSelectionState = {};
        
        Object.keys(newSelection).forEach(rowId => {
          const ingredient = data.find(item => item.id === rowId);
          if (ingredient && !ingredient.parentId) {
            filteredSelection[rowId] = newSelection[rowId];
          }
        });
        
        return filteredSelection;
      }
      
      // If child row selection is enabled, use the updater directly
      return typeof updater === 'function' ? updater(prevSelection) : updater;
    });
  }, [selectionConfig.enableChildRowSelection, data]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await dataSource.list();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Create hierarchical data structure
  const hierarchicalData = useMemo(() => {
    console.log("Building hierarchical data from:", data.length, "items");
    const result = AdvancedTableController.buildHierarchicalData(data);
    console.log("Hierarchical result:", result.length, "items");

    // Log parents with children
    const parentsWithChildren = result.filter(
      (item) => item.subRows && item.subRows.length > 0
    );
    console.log(
      "Parents with children:",
      parentsWithChildren.map(
        (p) => `${p.id}: ${p.name} (${p.subRows?.length} children)`
      )
    );

    return result;
  }, [data]);

  // Get selected ingredients for comparison
  const selectedIngredients = useMemo(() => {
    return data.filter((ingredient) => rowSelection[ingredient.id]);
  }, [data, rowSelection]);

  const canCompare =
    selectedIngredients.length >= 2 && selectedIngredients.length <= 5;

  // Define columns with compact design and expand/collapse functionality
  const columns = useMemo<ColumnDef<Ingredient>[]>(
    () => [
      // Expandable column for hierarchical data
      {
        id: "expander",
        header: "",
        cell: ({ row }) => {
          const hasChildren = row.getCanExpand();
          
          if (!hasChildren) {
            return <div className="w-4" />; // Empty space for non-expandable rows
          }

          return (
            <button
              type="button"
              onClick={row.getToggleExpandedHandler()}
              className="flex items-center justify-center w-4 h-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              style={{
                borderRadius: '4px',
                padding: '1em',
                backgroundColor: '#f9fafb'
              }}
              aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
            >
              {row.getIsExpanded() ? (
                <span className="text-gray-600 font-bold">−</span>
              ) : (
                <span className="text-gray-600 font-bold">+</span>
              )}
            </button>
          );
        },
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },

      // Compact selection column - only show if row selection is enabled
      ...(selectionConfig.enableRowSelection ? [{
        id: "select",
        header: ({ table }: { table: any }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        cell: ({ row }: { row: any }) => {
          // Check if this is a child row and child selection is disabled
          const isChildRow = !!(row.original as Ingredient).parentId;
          const canSelect = selectionConfig.enableChildRowSelection || !isChildRow;
          
          return (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!canSelect}
              onChange={row.getToggleSelectedHandler()}
              className={`h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                !canSelect ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={!canSelect ? 'Child row selection is disabled' : ''}
            />
          );
        },
        size: 32,
        enableSorting: false,
        enableHiding: false,
      }] : []),

      // Compact favorite column
      {
        accessorKey: "favorite",
        header: "★",
        cell: ({ getValue }) => {
          const isFavorite = getValue() as boolean;
          return (
            <span
              className={`text-sm ${
                isFavorite ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </span>
          );
        },
        size: 32,
      },

      // Compact name column with hierarchical indentation
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, getValue }) => {
          const value = getValue() as string;
          const depth = row.depth;

          return (
            <div
              className="flex items-center text-sm"
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <span
                className="font-medium text-gray-900 truncate"
                title={value}
              >
                {value}
              </span>
            </div>
          );
        },
        size: 180,
        filterFn: "includesString",
      },

      // Compact category column
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => (
          <span
            className="text-xs text-gray-700 truncate"
            title={getValue() as string}
          >
            {getValue() as string}
          </span>
        ),
        size: 100,
        filterFn: "arrIncludesSome",
      },

      // Compact status column with smaller badges
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const colorClass =
            {
              Active: "bg-green-100 text-green-700",
              Inactive: "bg-gray-100 text-gray-700",
              Limited: "bg-orange-100 text-orange-700",
            }[status] || "bg-gray-100 text-gray-700";

          return (
            <span
              className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${colorClass}`}
            >
              {status}
            </span>
          );
        },
        size: 80,
        filterFn: "arrIncludesSome",
      },

      // Compact type column
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue() as string;
          const colorClass =
            type === "Natural"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700";

          return (
            <span
              className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${colorClass}`}
            >
              {type}
            </span>
          );
        },
        size: 70,
        filterFn: "arrIncludesSome",
      },

      // Compact supplier column
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ getValue }) => (
          <span
            className="text-xs text-gray-600 truncate"
            title={getValue() as string}
          >
            {getValue() as string}
          </span>
        ),
        size: 90,
        filterFn: "arrIncludesSome",
      },

      // Compact cost column
      {
        accessorKey: "costPerKg",
        header: "Cost/kg",
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <span className="text-xs font-medium text-gray-900">
              ${value.toFixed(0)}
            </span>
          );
        },
        size: 70,
      },

      // Compact stock column
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue }) => {
          const stock = getValue() as number;
          let colorClass = "bg-green-100 text-green-700";

          if (stock === 0) colorClass = "bg-red-100 text-red-700";
          else if (stock < 50) colorClass = "bg-orange-100 text-orange-700";
          else if (stock < 150) colorClass = "bg-yellow-100 text-yellow-700";

          return (
            <span
              className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${colorClass}`}
            >
              {stock}kg
            </span>
          );
        },
        size: 60,
      },
    ],
    [selectionConfig.enableRowSelection, selectionConfig.enableChildRowSelection]
  );

  // Create table instance with all TanStack features
  const table = useReactTable({
    data: hierarchicalData,
    columns,
    state: {
      sorting,
      columnVisibility,
      expanded,
      pagination,
      rowSelection,
      globalFilter,
      columnFilters,
      grouping,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onRowSelectionChange: handleRowSelectionChange,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onGroupingChange: setGrouping,

    // Core models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),

    // Hierarchical configuration
    getSubRows: (row) => row.subRows || [],
    getRowCanExpand: (row) => !!(row.subRows && row.subRows.length > 0),

    // Row selection configuration - configurable through tableConfig
    enableRowSelection: selectionConfig.enableRowSelection,
    enableSubRowSelection: selectionConfig.enableChildRowSelection, // Configurable child row selection
    enableExpanding: tableConfig.expansion.enabled,
    enableSorting: tableConfig.sorting.enabled,
    enableHiding: tableConfig.columns.enableColumnVisibility,
    enableFilters: tableFilterConfig.enabled,
    enableColumnFilters: tableFilterConfig.enabled,
    enableGlobalFilter: tableFilterConfig.enabled,
    enableGrouping: tableConfig.grouping.enabled,
    globalFilterFn: "includesString",
    getRowId: (row) => row.id,
  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = data.length;
    const activeItems = data.filter((item) => item.status === "Active").length;
    const favoriteItems = data.filter((item) => item.favorite).length;
    const lowStockItems = data.filter((item) => item.stock < 50).length;

    return {
      total: totalItems,
      active: activeItems,
      favorites: favoriteItems,
      lowStock: lowStockItems,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show configuration page if requested
  if (showConfigPage) {
    return (
      <ConfigPage
        initialConfig={masterConfig}
        onConfigChange={handleConfigChange}
        onSave={handleConfigSave}
        onCancel={handleConfigCancel}
      />
    );
  }

  return (
    <div className="min-h-screen w-full space-y-4 md:space-y-6">
      {/* Header - Conditional based on UI config */}
      {UIConfigHelper.shouldShowComponent(uiConfig, 'header') && (
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 px-4 md:px-6">
          <div className="flex-1">
            {UIConfigHelper.getHeaderConfig(uiConfig).showTitle && (
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {UIConfigHelper.getHeaderConfig(uiConfig).title || "Ingredient Library"}
              </h1>
            )}
            {UIConfigHelper.getHeaderConfig(uiConfig).showDescription && (
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {UIConfigHelper.getHeaderConfig(uiConfig).description || 
                  "Manage your perfume ingredients with advanced filtering and hierarchical organization"}
              </p>
            )}
          </div>
          
          {/* Configuration Button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowConfigPage(true)}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 sm:w-auto"
            >
              ⚙️ Configure Table
            </button>
          </div>
        </div>
      )}

      {/* Stats Bar - Conditional based on UI config */}
      {UIConfigHelper.shouldShowComponent(uiConfig, 'stats') && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 px-4 md:px-6">
          {UIConfigHelper.getStatsConfig(uiConfig).showTotal && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Ingredients</div>
            </div>
          )}
          {UIConfigHelper.getStatsConfig(uiConfig).showActive && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          )}
          {UIConfigHelper.getStatsConfig(uiConfig).showFavorites && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.favorites}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          )}
          {UIConfigHelper.getStatsConfig(uiConfig).showLowStock && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.lowStock}
              </div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Controls Toolbar - Conditional based on UI config */}
      {UIConfigHelper.shouldShowComponent(uiConfig, 'toolbar') && (
        <div className="px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
          {/* Primary Toolbar */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 border-b border-gray-200 sm:px-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:gap-4">
              {/* Left Section - Search and Quick Actions */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:gap-3 flex-1">
                {/* Enhanced Search - Conditional */}
                {UIConfigHelper.getToolbarConfig(uiConfig).showSearch && (
                  <div className="relative flex-1 w-full sm:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search ingredients..."
                      value={globalFilter || ""}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    />
                    {globalFilter && (
                      <button
                        type="button"
                        onClick={() => setGlobalFilter("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-4 w-4 text-gray-400 hover:text-gray-600"
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
                      </button>
                    )}
                  </div>
                )}

                {/* Action Buttons Group */}
                <div className="flex flex-wrap items-center bg-white rounded-lg border border-gray-200 shadow-sm divide-x divide-gray-200 overflow-hidden">
                  {/* Filters Button - Conditional */}
                  {UIConfigHelper.getToolbarConfig(uiConfig).showFilters && (
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-l-lg transition-all duration-200 ${
                        showFilters
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
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
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                        />
                      </svg>
                      Filters
                    </button>
                  )}

                  {/* Column Manager Button - Conditional */}
                  {UIConfigHelper.getToolbarConfig(uiConfig).showColumnManager && (
                    <button
                      type="button"
                      onClick={() => setShowColumnManager(!showColumnManager)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                        />
                      </svg>
                      Columns
                    </button>
                  )}

                  {/* Group By Dropdown */}
                  <div className="relative">
                    <select
                      value={grouping[0] || ""}
                      onChange={(e) =>
                        setGrouping(e.target.value ? [e.target.value] : [])
                      }
                      className="appearance-none bg-transparent px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-r-lg transition-colors duration-200 border-0"
                    >
                      <option value="">No Grouping</option>
                      <option value="category">Group by Category</option>
                      <option value="status">Group by Status</option>
                      <option value="type">Group by Type</option>
                      <option value="supplier">Group by Supplier</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Stats and Selection Actions */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:gap-4">
                {/* Stats Display */}
                <div className="flex items-center gap-4 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">
                      {data.length}
                    </span>
                    <span>total records</span>
                  </div>
                </div>

                {/* Selection Actions */}
                {selectedIngredients.length > 0 && (
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {selectedIngredients.length} selected
                      </span>
                    </div>

                    {/* Compare Button - Conditional */}
                    {canCompare && UIConfigHelper.getToolbarConfig(uiConfig).showCompare && (
                      <button
                        type="button"
                        onClick={() => setShowCompareDialog(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 00-2 2H9z"
                          />
                        </svg>
                        Compare ({selectedIngredients.length})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setRowSelection({})}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
                      title="Clear selection"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="px-4 md:px-6">
          <div className="bg-gray-50 border-b border-gray-200 w-full">
            <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                Advanced Filters
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setColumnFilters([{ id: "favorite", value: true }]);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
                >
                  <span className="text-amber-500">★</span>
                  Favorites Only
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setColumnFilters([]);
                    setGlobalFilter("");
                    setGrouping([]);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {FILTER_CONFIG.filter((config) => config.enabled).map(
                (filterConfig) => (
                  <div
                    key={filterConfig.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      {filterConfig.icon}
                      {filterConfig.label}
                    </label>

                    {filterConfig.type === "checkbox" ? (
                      <div className="space-y-2">
                        {filterConfig.options.map((option) => {
                          const isSelected = (
                            (columnFilters.find(
                              (f) => f.id === filterConfig.id
                            )?.value as string[]) || []
                          ).includes(option.value);
                          return (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentValues =
                                    (columnFilters.find(
                                      (f) => f.id === filterConfig.id
                                    )?.value as string[]) || [];
                                  const newValues = e.target.checked
                                    ? [...currentValues, option.value]
                                    : currentValues.filter(
                                        (v) => v !== option.value
                                      );
                                  setColumnFilters((prev) =>
                                    prev
                                      .filter((f) => f.id !== filterConfig.id)
                                      .concat(
                                        newValues.length > 0
                                          ? [
                                              {
                                                id: filterConfig.id,
                                                value: newValues,
                                              },
                                            ]
                                          : []
                                      )
                                  );
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <select
                        multiple
                        size={4}
                        value={
                          (columnFilters.find((f) => f.id === filterConfig.id)
                            ?.value as string[]) || []
                        }
                        onChange={(e) => {
                          const values = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          setColumnFilters((prev) =>
                            prev
                              .filter((f) => f.id !== filterConfig.id)
                              .concat(
                                values.length > 0
                                  ? [{ id: filterConfig.id, value: values }]
                                  : []
                              )
                          );
                        }}
                        className="w-full text-xs border-0 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          {filterConfig.options.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="py-1"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Column Manager Panel */}
        {showColumnManager && (
          <div className="px-4 md:px-6">
            <div className="bg-gray-50 border-b border-gray-200 w-full">
              <div className="px-4 py-5 sm:px-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                  />
                </svg>
                Column Visibility
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {table.getAllLeafColumns().map((column) => {
                  const isVisible = column.getIsVisible();
                  return (
                    <label
                      key={column.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isVisible
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={column.getToggleVisibilityHandler()}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">
                        {column.id === "expander"
                          ? "Expand"
                          : column.id === "select"
                          ? "Select"
                          : (column.columnDef.header as string) || column.id}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          </div>
        )}

      {/* Compact Table */}
      <div className="px-4 md:px-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                        {header.column.getCanSort() && (
                          <span className="text-gray-400 text-xs">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    row.getIsSelected() ? "bg-blue-50" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Pagination - Conditional based on UI config */}
      {UIConfigHelper.shouldShowComponent(uiConfig, 'pagination') && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 px-4 md:px-6">
          {/* Page Size Selector - Conditional */}
          {UIConfigHelper.getPaginationConfig(uiConfig).showPageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {UIConfigHelper.getPaginationConfig(uiConfig).pageSizeOptions.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          )}

          {/* Navigation Controls - Conditional */}
          {UIConfigHelper.getPaginationConfig(uiConfig).showNavigationButtons && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {/* Page Info - Conditional */}
              {UIConfigHelper.getPaginationConfig(uiConfig).showPageInfo && (
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              )}

              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Last
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comparison Dialog */}
      <CompareDialog
        ingredients={selectedIngredients}
        open={showCompareDialog}
        onOpenChange={setShowCompareDialog}
      />
    </div>
  );
};