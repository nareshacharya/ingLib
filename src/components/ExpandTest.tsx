import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { AdvancedTableController } from "../features/ingredient-library/controller/advancedTableController";
import { INGREDIENTS_SEED } from "../features/ingredient-library/data/ingredients.sample";

type Ingredient = (typeof INGREDIENTS_SEED)[0];

const columnHelper = createColumnHelper<Ingredient>();

export const ExpandTest: React.FC = () => {
  const data = useMemo(() => {
    // Take first few ingredients and their hierarchical structure
    const hierarchicalData =
      AdvancedTableController.buildHierarchicalData(INGREDIENTS_SEED);
    const firstFewWithChildren = hierarchicalData
      .filter((item) => item.subRows && item.subRows.length > 0)
      .slice(0, 3);
    console.log("Test data with children:", firstFewWithChildren);
    return firstFewWithChildren;
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "expander",
        header: "Expand",
        cell: ({ row }) => {
          console.log(
            `Row ${
              row.id
            }: canExpand=${row.getCanExpand()}, isExpanded=${row.getIsExpanded()}`
          );
          return row.getCanExpand() ? (
            <button
              onClick={row.getToggleExpandedHandler()}
              style={{
                cursor: "pointer",
                border: "1px solid #ccc",
                padding: "4px 8px",
                backgroundColor: row.getIsExpanded() ? "#e0e0e0" : "#f5f5f5",
              }}
            >
              {row.getIsExpanded() ? "−" : "+"}
            </button>
          ) : (
            "○"
          );
        },
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getSubRows: (row) => row.subRows,
    getRowCanExpand: (row) => !!(row.subRows && row.subRows.length > 0),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="p-4 border-b bg-yellow-50">
      <h2 className="text-lg font-bold mb-4">Expand/Collapse Test</h2>
      <p className="mb-4">Found {data.length} parent items with children</p>

      <table className="border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 px-4 py-2"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ paddingLeft: `${row.depth * 20}px` }}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
