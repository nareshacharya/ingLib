import React from "react";
import { flexRender } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";
import type { Ingredient } from "../../model/types";
import { tableStyles } from "../../styles";
import { Loading } from "./Loading";
import { Empty } from "./Empty";
import { ErrorState } from "./ErrorState";

interface DataTableProps {
  table: Table<Ingredient>;
  visibleColumns?: Record<string, boolean>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  table,
  visibleColumns = {},
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return <Loading message="Loading ingredients..." />;
  }

  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <Empty
        title="No ingredients found"
        description="Try adjusting your search or filter criteria"
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className={tableStyles.root}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={tableStyles.header}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={tableStyles.headerRow}>
              {headerGroup.headers.map((header) => {
                const columnId = header.column.id;
                const isHidden = visibleColumns[columnId] === false;

                return (
                  <th
                    key={header.id}
                    className={`${
                      header.column.getCanSort()
                        ? tableStyles.thSortable
                        : tableStyles.th
                    } ${isHidden ? "hidden" : ""}`}
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
                        <span className={tableStyles.sortIcon}>
                          {header.column.getIsSorted() === "asc" ? (
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
                                d="M7 14l5-5 5 5"
                              />
                            </svg>
                          ) : header.column.getIsSorted() === "desc" ? (
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
                                d="M7 10l5 5 5-5"
                              />
                            </svg>
                          ) : (
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
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => {
            const isSelected = row.getIsSelected();
            const isExpanded = row.getIsExpanded();
            const level = (row.original as any).level || 0;

            return (
              <tr
                key={row.id}
                className={`${tableStyles.row} ${
                  isExpanded ? tableStyles.rowExpanded : ""
                } ${level > 0 ? tableStyles.rowChild : ""}`}
                data-selected={isSelected}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnId = cell.column.id;
                  const isHidden = visibleColumns[columnId] === false;

                  return (
                    <td
                      key={cell.id}
                      className={`${tableStyles.td} ${
                        isHidden ? "hidden" : ""
                      }`}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
