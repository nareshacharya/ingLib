import React, { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  GroupingState,
  ExpandedState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  PaginationState,
} from "@tanstack/react-table";
import { LocalDataSource } from "../services/localDataSource";
import type { Ingredient } from "../model/types";
import { FilterDropdown } from "./components/FilterDropdown";
import { CompareDialog } from "./components/CompareDialog";
import { ColumnManager } from "./components/ColumnManager";
import {
  categoryOptions,
  statusOptions,
  typeOptions,
  supplierOptions,
  stockLevelOptions,
} from "../constants/filterOptions";
import { filterRows, formatCurrency, debounce } from "../controller/selectors";
import {
  AdvancedTableController,
  defaultAdvancedTableState,
} from "../controller/advancedTableController";

const dataSource = new LocalDataSource();
const columnHelper = createColumnHelper<Ingredient>();

export const IngredientLibrary: React.FC = () => {
  const [data, setData] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved table state or use defaults
  const savedState = AdvancedTableController.loadTableState(
    "ingredient-library-table"
  );

  // Load saved column configuration separately for better control
  const getSavedColumnVisibility = (): VisibilityState => {
    try {      
      const saved = localStorage.getItem("ingredient-library-columns");
      const savedVisibility = saved ? JSON.parse(saved) : {};

      // Ensure fixed columns are always visible
      const result = {
        ...savedVisibility,
        select: true,
        expander: true,
      };
      console.log("Column visibility configuration:", result);
      return result;
    } catch (error) {
      console.warn("Failed to load saved column configuration:", error);
      return {
        select: true,
        expander: true,
      };
    }
  };

  // Merge saved column visibility into saved state
  const mergedSavedState = {
    ...savedState,
    columnVisibility: {
      ...savedState?.columnVisibility,
      ...getSavedColumnVisibility(),
    },
  };

  const initialState = AdvancedTableController.mergeTableState(
    defaultAdvancedTableState,
    mergedSavedState
  );

  // Basic table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);

  // Advanced table state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState.columnVisibility
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    initialState.columnOrder
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    initialState.columnPinning
  );
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    initialState.columnSizing
  );
  const [expanded, setExpanded] = useState<ExpandedState>(
    initialState.expanded
  );
  const [pagination, setPagination] = useState<PaginationState>({
    ...initialState.pagination,
    pageIndex: 0, // Force to first page to see parent rows
    pageSize: 50, // Increase page size to see more items
  });

  // UI state
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  // Filter state
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [supplierFilter, setSupplierFilter] = useState<string[]>([]);
  const [stockLevelFilter, setStockLevelFilter] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Compare dialog state
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  // Filters panel state
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Debounced search
  const debouncedSetGlobalFilter = useMemo(
    () => debounce((value: string) => setGlobalFilter(value), 300),
    []
  );

  // Filtered data based on custom filters
  const filteredData = useMemo(() => {
    const baseFiltered = filterRows(data, {
      search: globalFilter,
      categories: categoryFilter,
      statuses: statusFilter as any[],
      types: typeFilter as any[],
      suppliers: supplierFilter,
      stockLevels: stockLevelFilter as any[],
      favoritesOnly,
    });

    // Include child rows when their parent is included
    const parentIds = new Set(
      baseFiltered.filter((item) => !item.parentId).map((item) => item.id)
    );
    const childRows = data.filter(
      (item) => item.parentId && parentIds.has(item.parentId)
    );

    // Combine parent rows and their children
    const result = [...baseFiltered];
    childRows.forEach((child) => {
      if (!result.find((item) => item.id === child.id)) {
        result.push(child);
      }
    });

    return result;
  }, [
    data,
    globalFilter,
    categoryFilter,
    statusFilter,
    typeFilter,
    supplierFilter,
    stockLevelFilter,
    favoritesOnly,
  ]);

  // Process data for hierarchical structure
  const hierarchicalData = useMemo(() => {
    const result = AdvancedTableController.buildHierarchicalData(filteredData);
    
    const parentsWithChildren = result.filter(item => item.subRows && item.subRows.length > 0);
    console.log("Found", parentsWithChildren.length, "parents with children:", parentsWithChildren.map(item => `${item.id}: ${item.name}`));
    
    return result;
  }, [filteredData]);

  // Selected ingredients for comparison - use filtered data not hierarchical
  const selectedIngredients = useMemo(() => {
    // Get selected rows from the filtered data (flattened, including children)
    const allData = [...filteredData];

    // With getRowId using ingredient.id, rowSelection now contains ingredient IDs as keys
    const selected = allData.filter(
      (ingredient) => rowSelection[ingredient.id]
    );

    return selected;
  }, [filteredData, rowSelection]);

  const columns = useMemo(
    () => [
      // Selection column
      {
        id: "select",
        header: ({ table }: any) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el)
                el.indeterminate =
                  table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      // Expander column for hierarchical data
      columnHelper.display({
        id: "expander",
        header: () => <span className="sr-only">Expand</span>,
        cell: ({ row }) => {
          const canExpand = row.getCanExpand();
          const isExpanded = row.getIsExpanded();

          console.log(`Row ${row.id}: canExpand=${canExpand}, isExpanded=${isExpanded}, original:`, row.original);

          return (
            <div className="flex items-center justify-center w-8 h-8">
              {canExpand ? (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded border border-gray-300 transition-all duration-150 text-sm font-mono shadow-sm"
                  style={{ minWidth: "24px", minHeight: "24px" }}
                  aria-label={isExpanded ? "Collapse row" : "Expand row"}
                >
                  {isExpanded ? "−" : "+"}
                </button>
              ) : (
                <div className="w-6 h-6"></div>
              )}
            </div>
          );
        },
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: 50,
      }),
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-gray-600">
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
        enableGrouping: false,
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => {
          const ingredient = info.row.original;
          const isChild = !!ingredient.parentId;
          const depth = info.row.depth;

          return (
            <div
              className={`text-sm ${
                isChild || depth > 0
                  ? `ml-${(depth + 1) * 4} text-gray-600`
                  : "font-medium text-gray-900"
              }`}
            >
              {info.getValue()}
            </div>
          );
        },
        enableSorting: true,
        enableGrouping: false,
        size: 250,
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
        enableGrouping: true,
        size: 150,
      }),
      columnHelper.accessor("family", {
        header: "Family",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
        enableGrouping: true,
        size: 120,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              info.getValue() === "Active"
                ? "bg-green-100 text-green-800"
                : info.getValue() === "Limited"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
        enableGrouping: true,
        size: 100,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              info.getValue() === "Natural"
                ? "bg-blue-100 text-blue-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
        enableGrouping: true,
        size: 100,
      }),
      columnHelper.accessor("supplier", {
        header: "Supplier",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
        enableGrouping: true,
        size: 120,
      }),
      columnHelper.accessor("costPerKg", {
        header: "Cost/kg",
        cell: (info) => (
          <span className="text-sm text-gray-900 font-mono">
            {formatCurrency(info.getValue())}
          </span>
        ),
        enableSorting: true,
        enableGrouping: false,
        size: 100,
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) => {
          const stock = info.getValue();
          return (
            <span
              className={`text-sm font-medium ${
                stock === 0
                  ? "text-red-600"
                  : stock < 50
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {stock} kg
            </span>
          );
        },
        enableSorting: true,
        enableGrouping: false,
        size: 80,
      }),
      columnHelper.accessor("favorite", {
        header: "★",
        cell: (info) => (
          <span
            className={`text-lg ${
              info.getValue() ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ),
        enableSorting: true,
        enableGrouping: false,
        size: 50,
      }),
      columnHelper.accessor("casNumber", {
        header: "CAS Number",
        cell: (info) => (
          <span className="font-mono text-xs text-gray-600">
            {info.getValue() || "-"}
          </span>
        ),
        enableSorting: true,
        enableGrouping: false,
        size: 120,
      }),
      columnHelper.accessor("ifraLimitPct", {
        header: "IFRA Limit %",
        cell: (info) => {
          const value = info.getValue();
          return (
            <span className="text-sm text-gray-900">
              {value ? `${value}%` : "-"}
            </span>
          );
        },
        enableSorting: true,
        enableGrouping: false,
        size: 100,
      }),
      columnHelper.accessor("allergens", {
        header: "Allergens",
        cell: (info) => {
          const allergens = info.getValue() || [];
          return allergens.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {allergens.slice(0, 2).map((allergen) => (
                <span
                  key={allergen}
                  className="px-1 py-0.5 text-xs bg-orange-100 text-orange-800 rounded"
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
          ) : (
            <span className="text-gray-400 text-xs">None</span>
          );
        },
        enableSorting: false,
        enableGrouping: false,
        size: 200,
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated",
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-xs text-gray-500">
              {date.toLocaleDateString()}
            </span>
          );
        },
        enableSorting: true,
        enableGrouping: false,
        size: 100,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: hierarchicalData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
      expanded,
      columnOrder,
      columnPinning,
      columnSizing,
      pagination,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: true,
    enableGrouping: true,
    enableExpanding: true,
    enableColumnResizing: false,
    enableColumnPinning: true,
    manualPagination: false,
    getRowId: (row) => row.id, // Use ingredient ID instead of index
    getSubRows: (row) => {
      return row.subRows || [];
    },
    getRowCanExpand: (row) => {
      const canExpand = !!(row.subRows && row.subRows.length > 0);
      return canExpand;
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  // Save table state to localStorage when it changes
  React.useEffect(() => {
    const stateToSave = {
      columnVisibility,
      columnOrder,
      columnPinning,
      columnSizing,
      pagination,
    };
    AdvancedTableController.saveTableState(
      "ingredient-library-table",
      stateToSave
    );
  }, [columnVisibility, columnOrder, columnPinning, columnSizing, pagination]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
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

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-none">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Ingredient Library
          </h1>

          {/* Search and Filters Toolbar */}
          <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
            <div className="p-4">
              {/* Search Bar and Filters Button */}
              <div className="flex gap-4 items-end">
                {/* Global Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Ingredients
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, category, family, supplier, CAS number, or allergens..."
                    onChange={(e) => debouncedSetGlobalFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Column Manager Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setColumnManagerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                </div>

                {/* Filters Toggle Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className={`inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      filtersExpanded
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-gray-700 hover:bg-gray-50"
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0111 21v-6.586a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z"
                      />
                    </svg>
                    Filters
                    {(categoryFilter.length > 0 ||
                      statusFilter.length > 0 ||
                      typeFilter.length > 0 ||
                      supplierFilter.length > 0 ||
                      stockLevelFilter.length > 0 ||
                      favoritesOnly ||
                      grouping.length > 0) && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                        {categoryFilter.length +
                          statusFilter.length +
                          typeFilter.length +
                          supplierFilter.length +
                          stockLevelFilter.length +
                          (favoritesOnly ? 1 : 0) +
                          grouping.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        filtersExpanded ? "rotate-180" : ""
                      }`}
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
                  </button>
                </div>

                {/* Compare Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setCompareDialogOpen(true)}
                    disabled={
                      selectedIngredients.length < 2 ||
                      selectedIngredients.length > 5
                    }
                    className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    title={
                      selectedIngredients.length < 2
                        ? "Select 2-5 ingredients to compare"
                        : selectedIngredients.length > 5
                        ? "Maximum 5 ingredients can be compared"
                        : "Compare selected ingredients"
                    }
                  >
                    Compare ({selectedIngredients.length}/5)
                  </button>
                </div>
              </div>

              {/* Collapsible Filters Panel */}
              {filtersExpanded && (
                <div className=" mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <FilterDropdown
                        label="All Categories"
                        options={categoryOptions}
                        selectedValues={categoryFilter}
                        onSelectionChange={setCategoryFilter}
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <FilterDropdown
                        label="All Statuses"
                        options={statusOptions}
                        selectedValues={statusFilter}
                        onSelectionChange={setStatusFilter}
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <FilterDropdown
                        label="All Types"
                        options={typeOptions}
                        selectedValues={typeFilter}
                        onSelectionChange={setTypeFilter}
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier
                      </label>
                      <FilterDropdown
                        label="All Suppliers"
                        options={supplierOptions}
                        selectedValues={supplierFilter}
                        onSelectionChange={setSupplierFilter}
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Level
                      </label>
                      <FilterDropdown
                        label="All Levels"
                        options={stockLevelOptions}
                        selectedValues={stockLevelFilter}
                        onSelectionChange={setStockLevelFilter}
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group By
                      </label>
                      <select
                        value={grouping[0] || ""}
                        onChange={(e) =>
                          setGrouping(e.target.value ? [e.target.value] : [])
                        }
                        className="w-full inline-flex items-center justify-between gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-2.5 min-h-[42px]"
                      >
                        <option value="">No grouping</option>
                        <option value="category">Category</option>
                        <option value="family">Family</option>
                        <option value="supplier">Supplier</option>
                        <option value="type">Type</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Favorites
                      </label>
                      <label className="flex items-center justify-center h-10 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={favoritesOnly}
                          onChange={(e) => setFavoritesOnly(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Only Favorites
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
            <div className="p-4">
              <div className="text-sm text-gray-600">
                {filteredData.length} of {data.length} ingredients
                {data.length !== filteredData.length && " (filtered)"}
                {selectedIngredients.length > 0 && (
                  <span className="ml-4">
                    {selectedIngredients.length} selected
                  </span>
                )}
              </div>

              {/* Active Filters Display */}
              {(categoryFilter.length > 0 ||
                statusFilter.length > 0 ||
                typeFilter.length > 0 ||
                supplierFilter.length > 0 ||
                stockLevelFilter.length > 0 ||
                favoritesOnly ||
                globalFilter ||
                grouping.length > 0) && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-start gap-3 flex-wrap">
                    <span className="text-sm font-medium text-gray-700 py-1">
                      Active filters:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {globalFilter && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Search: "{globalFilter}"
                        </span>
                      )}
                      {grouping.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Grouped by: {grouping[0]}
                        </span>
                      )}
                      {categoryFilter.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          Category: {cat}
                        </span>
                      ))}
                      {statusFilter.map((status) => (
                        <span
                          key={status}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          Status: {status}
                        </span>
                      ))}
                      {typeFilter.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          Type: {type}
                        </span>
                      ))}
                      {supplierFilter.map((supplier) => (
                        <span
                          key={supplier}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          Supplier: {supplier}
                        </span>
                      ))}
                      {stockLevelFilter.map((level) => (
                        <span
                          key={level}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          Stock: {level}
                        </span>
                      ))}
                      {favoritesOnly && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Favorites Only
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setGlobalFilter("");
                          setCategoryFilter([]);
                          setStatusFilter([]);
                          setTypeFilter([]);
                          setSupplierFilter([]);
                          setStockLevelFilter([]);
                          setFavoritesOnly(false);
                          setGrouping([]);
                        }}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spacing when filters are expanded */}
          {filtersExpanded && <div className="h-6"></div>}

          {/* Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 table-auto min-w-[1200px]">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative ${
                            header.column.getCanSort()
                              ? "cursor-pointer hover:bg-gray-100 select-none"
                              : ""
                          } ${
                            header.column.getIsPinned() === "left"
                              ? "sticky left-0 z-10 bg-gray-50 border-r border-gray-300"
                              : header.column.getIsPinned() === "right"
                              ? "sticky right-0 z-10 bg-gray-50 border-l border-gray-300"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            width:
                              header.id === "select"
                                ? "50px"
                                : header.id === "expand"
                                ? "50px"
                                : header.id === "id"
                                ? "120px"
                                : header.id === "name"
                                ? "300px"
                                : header.id === "category"
                                ? "150px"
                                : header.id === "family"
                                ? "140px"
                                : header.id === "type"
                                ? "120px"
                                : header.id === "cas"
                                ? "140px"
                                : header.id === "einecs"
                                ? "120px"
                                : header.id === "origin"
                                ? "100px"
                                : "120px",
                            minWidth:
                              header.id === "select"
                                ? "50px"
                                : header.id === "expand"
                                ? "50px"
                                : "80px",
                            left:
                              header.column.getIsPinned() === "left"
                                ? `${header.column.getStart("left")}px`
                                : undefined,
                            right:
                              header.column.getIsPinned() === "right"
                                ? `${header.column.getAfter("right")}px`
                                : undefined,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            {header.column.getCanSort() && (
                              <div className="flex flex-col ml-1">
                                <span
                                  className={`text-xs leading-none ${
                                    header.column.getIsSorted() === "asc"
                                      ? "text-blue-600"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ▲
                                </span>
                                <span
                                  className={`text-xs leading-none ${
                                    header.column.getIsSorted() === "desc"
                                      ? "text-blue-600"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ▼
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Column resize handle */}
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={`absolute top-0 right-0 w-1 h-full bg-gray-300 cursor-col-resize opacity-0 hover:opacity-100 ${
                                header.column.getIsResizing()
                                  ? "opacity-100 bg-blue-500"
                                  : ""
                              }`}
                            />
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          row.getIsSelected()
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        } ${
                          row.getIsGrouped() ? "bg-gray-100 font-semibold" : ""
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={`px-3 py-4 text-sm text-gray-900 break-words ${
                              cell.column.getIsPinned() === "left"
                                ? "sticky left-0 z-10 bg-white border-r border-gray-200"
                                : cell.column.getIsPinned() === "right"
                                ? "sticky right-0 z-10 bg-white border-l border-gray-200"
                                : ""
                            } ${row.getIsSelected() ? "bg-blue-50" : ""}`}
                            style={{
                              width:
                                cell.column.id === "select"
                                  ? "50px"
                                  : cell.column.id === "expander"
                                  ? "50px"
                                  : cell.column.id === "id"
                                  ? "120px"
                                  : cell.column.id === "name"
                                  ? "300px"
                                  : cell.column.id === "category"
                                  ? "150px"
                                  : cell.column.id === "family"
                                  ? "140px"
                                  : cell.column.id === "type"
                                  ? "120px"
                                  : cell.column.id === "cas"
                                  ? "140px"
                                  : cell.column.id === "einecs"
                                  ? "120px"
                                  : cell.column.id === "origin"
                                  ? "100px"
                                  : "120px",
                              minWidth:
                                cell.column.id === "select"
                                  ? "50px"
                                  : cell.column.id === "expander"
                                  ? "50px"
                                  : "80px",
                              left:
                                cell.column.getIsPinned() === "left"
                                  ? `${cell.column.getStart("left")}px`
                                  : undefined,
                              right:
                                cell.column.getIsPinned() === "right"
                                  ? `${cell.column.getAfter("right")}px`
                                  : undefined,
                            }}
                          >
                            {cell.getIsGrouped() ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={row.getToggleExpandedHandler()}
                                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                  {row.getIsExpanded() ? "−" : "+"}
                                </button>
                                <span>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </span>
                                <span className="text-gray-500 font-normal">
                                  ({row.subRows.length})
                                </span>
                              </div>
                            ) : cell.getIsAggregated() ? (
                              flexRender(
                                cell.column.columnDef.aggregatedCell ??
                                  cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            ) : cell.getIsPlaceholder() ? null : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination and Results Info */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Showing{" "}
                    {table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      1}{" "}
                    to{" "}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} entries
                  </span>

                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="ml-4 text-sm border-gray-300 rounded-md"
                  >
                    {[10, 25, 50, 100].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    {"<"}
                  </button>

                  <span className="flex items-center gap-1">
                    <span className="text-sm text-gray-700">Page</span>
                    <strong className="text-sm">
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </strong>
                  </span>

                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    {">>"}
                  </button>

                  <span className="text-sm text-gray-700">| Go to page:</span>
                  <input
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  {data.length !== filteredData.length && (
                    <span className="text-gray-500">
                      (filtered from{" "}
                      <span className="font-medium">{data.length}</span> total)
                    </span>
                  )}
                </div>
                {selectedIngredients.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">
                      {selectedIngredients.length} selected for comparison
                    </span>
                    {selectedIngredients.length >= 2 &&
                      selectedIngredients.length <= 5 && (
                        <span className="text-green-600 text-xs">
                          ● Ready to compare
                        </span>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compare Dialog */}
          <CompareDialog
            ingredients={selectedIngredients}
            open={compareDialogOpen}
            onOpenChange={setCompareDialogOpen}
          />

          {/* Column Manager Dialog */}
          <ColumnManager
            open={columnManagerOpen}
            onOpenChange={setColumnManagerOpen}
            table={table}
          />
        </div>
      </div>
    </div>
  );
};
