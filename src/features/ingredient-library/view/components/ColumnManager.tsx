import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Table } from "@tanstack/react-table";
import type { Ingredient } from "../../model/types";
import { modalStyles } from "../../styles";

export interface ColumnManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<Ingredient>;
}

// Column labels for display
const COLUMN_LABELS: Record<string, string> = {
  select: "Select",
  expander: "Expand",
  id: "ID",
  name: "Name",
  category: "Category",
  family: "Family",
  status: "Status",
  type: "Type",
  supplier: "Supplier",
  costPerKg: "Cost/kg",
  stock: "Stock",
  casNumber: "CAS Number",
  ifraLimitPct: "IFRA Limit %",
  allergens: "Allergens",
  updatedAt: "Updated At",
  favorite: "Favorite",
  actions: "Actions",
};

// Non-hideable columns
const FIXED_COLUMNS = ["select", "expander"];

export function ColumnManager({
  open,
  onOpenChange,
  table,
}: ColumnManagerProps) {
  const [localVisibility, setLocalVisibility] = useState(
    () => table.getState().columnVisibility
  );

  // Update local state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalVisibility(table.getState().columnVisibility);
    }
  }, [open, table]);

  // Get all columns from the table
  const allColumns = table.getAllColumns();

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    if (FIXED_COLUMNS.includes(columnId)) return;

    setLocalVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // Handle row click to toggle visibility
  const handleRowClick = (columnId: string) => {
    toggleColumnVisibility(columnId);
  };

  // Apply changes and save to localStorage
  const handleApply = () => {
    table.setColumnVisibility(localVisibility);
    
    // Save column visibility to localStorage for persistence
    try {
      localStorage.setItem('ingredient-library-columns', JSON.stringify(localVisibility));
    } catch (error) {
      console.warn('Failed to save column configuration:', error);
    }
    
    onOpenChange(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setLocalVisibility(table.getState().columnVisibility);
    onOpenChange(false);
  };

  // Reset to show all columns
  const showAllColumns = () => {
    const allVisible = allColumns.reduce((acc, column) => {
      acc[column.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setLocalVisibility(allVisible);
  };

  // Hide all optional columns
  const hideAllColumns = () => {
    const onlyFixed = allColumns.reduce((acc, column) => {
      acc[column.id] = FIXED_COLUMNS.includes(column.id);
      return acc;
    }, {} as Record<string, boolean>);
    setLocalVisibility(onlyFixed);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={modalStyles.overlay} />
        <Dialog.Content className={modalStyles.content}>
          <div className={modalStyles.header}>
            <Dialog.Title className={modalStyles.title}>
              Manage Columns
            </Dialog.Title>
            <Dialog.Description className={modalStyles.description}>
              Choose which columns to show or hide in the table.
            </Dialog.Description>
          </div>

          <div className={modalStyles.body}>
            {/* Summary - moved to top */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>
                  {Object.values(localVisibility).filter(Boolean).length} of{" "}
                  {allColumns.length}
                </strong>{" "}
                columns will be visible
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={showAllColumns}
                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                Show All
              </button>
              <button
                onClick={hideAllColumns}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors"
              >
                Hide All Optional
              </button>
            </div>

            {/* Column List */}
            <div className="space-y-2">
              {allColumns.map((column) => {
                const isFixed = FIXED_COLUMNS.includes(column.id);
                const isVisible = localVisibility[column.id] !== false;
                const label = COLUMN_LABELS[column.id] || column.id;

                return (
                  <div
                    key={column.id}
                    className={`
                      flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white
                      ${isFixed ? "opacity-75" : "hover:bg-gray-50 cursor-pointer"}
                      transition-colors
                    `}
                    onClick={() => handleRowClick(column.id)}
                  >
                    {/* Fixed indicator */}
                    <div className="w-6 text-center">
                      {isFixed ? (
                        <span
                          className="text-gray-400 text-xs"
                          title="Always visible"
                        >
                          🔒
                        </span>
                      ) : (
                        <span className="text-gray-300">•</span>
                      )}
                    </div>

                    {/* Visibility checkbox */}
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => toggleColumnVisibility(column.id)}
                      onClick={(e) => e.stopPropagation()} // Prevent double toggle when clicking checkbox directly
                      disabled={isFixed}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />

                    {/* Column name */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm font-medium ${
                          isVisible ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                      {isFixed && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Always visible)
                        </span>
                      )}
                    </div>

                    {/* Visibility status */}
                    <div className="text-xs">
                      {isVisible ? (
                        <span className="text-green-600 font-medium">
                          Visible
                        </span>
                      ) : (
                        <span className="text-gray-500">Hidden</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={modalStyles.footer}>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>

          <Dialog.Close className={modalStyles.closeButton}>
            <span className="sr-only">Close</span>✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
