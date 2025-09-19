import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { LocalDataSource } from "../services/localDataSource";
import type { Ingredient } from "../model/types";
import { AdvancedTableController } from "../controller/advancedTableController";
import { Icon } from "../theme/icons";

const dataSource = new LocalDataSource();

export const IngredientLibrary: React.FC = () => {
  // Data state
  const [data, setData] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");

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

  // Define columns with expand/collapse functionality
  const columns = useMemo<ColumnDef<Ingredient>[]>(
    () => [
      // Expander column
      {
        id: "expander",
        header: "",
        cell: ({ row }) => {
          const hasChildren = row.getCanExpand();
          if (!hasChildren) {
            return <div className="w-4" />;
          }

          return (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="flex items-center justify-center w-4 h-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              {row.getIsExpanded() ? (
                <Icon name="chevronDown" size="sm" />
              ) : (
                <Icon name="chevronRight" size="sm" />
              )}
            </button>
          );
        },
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },

      // Selection column
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },

      // Favorite column
      {
        accessorKey: "favorite",
        header: "★",
        cell: ({ getValue }) => {
          const isFavorite = getValue() as boolean;
          return (
            <span
              className={`text-lg ${
                isFavorite ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </span>
          );
        },
        size: 60,
      },

      // Name column with hierarchical indentation
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, getValue }) => {
          const value = getValue() as string;
          const depth = row.depth;

          return (
            <div
              className="flex items-center"
              style={{ paddingLeft: `${depth * 20}px` }}
            >
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          );
        },
        size: 250,
      },

      // Category column
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
        size: 150,
      },

      // Family column
      {
        accessorKey: "family",
        header: "Family",
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue() as string}</span>
        ),
        size: 120,
      },

      // Status column with badges
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const colorClass =
            {
              Active: "bg-green-100 text-green-800",
              Inactive: "bg-gray-100 text-gray-800",
              Limited: "bg-orange-100 text-orange-800",
            }[status] || "bg-gray-100 text-gray-800";

          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
            >
              {status}
            </span>
          );
        },
        size: 100,
      },

      // Type column with badges
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue() as string;
          const colorClass =
            type === "Natural"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-blue-100 text-blue-800";

          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
            >
              {type}
            </span>
          );
        },
        size: 100,
      },

      // Supplier column
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
        size: 120,
      },

      // Cost column with currency formatting
      {
        accessorKey: "costPerKg",
        header: "Cost/kg",
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(value)}
            </span>
          );
        },
        size: 100,
      },

      // Stock column with indicators
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue }) => {
          const stock = getValue() as number;
          let colorClass = "bg-green-100 text-green-800";

          if (stock === 0) colorClass = "bg-red-100 text-red-800";
          else if (stock < 50) colorClass = "bg-orange-100 text-orange-800";
          else if (stock < 150) colorClass = "bg-yellow-100 text-yellow-800";

          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
            >
              {stock} kg
            </span>
          );
        },
        size: 100,
      },
    ],
    []
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
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    // Core models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // Hierarchical configuration
    getSubRows: (row) => row.subRows || [],
    getRowCanExpand: (row) => !!(row.subRows && row.subRows.length > 0),

    // Other settings
    enableRowSelection: true,
    enableExpanding: true,
    enableSorting: true,
    enableHiding: true,
    enableFilters: true,
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ingredient Library</h1>
        <p className="text-gray-600 mt-2">
          Manage your perfume ingredients with advanced filtering and
          hierarchical organization
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Ingredients</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.favorites}
          </div>
          <div className="text-sm text-gray-600">Favorites</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {stats.lowStock}
          </div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {table.getFilteredRowModel().rows.length} of {data.length}{" "}
            ingredients
          </span>

          {Object.keys(rowSelection).length > 0 && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {Object.keys(rowSelection).length} selected
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
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
                  className={`hover:bg-gray-50 ${
                    row.getIsSelected() ? "bg-blue-50" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="px-3 py-1 text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};
