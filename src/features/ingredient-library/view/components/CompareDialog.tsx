import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Ingredient } from "../../model/types";
import { modalStyles } from "../../styles";
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from "../../controller/selectors";

interface CompareDialogProps {
  ingredients: Ingredient[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const compareFields = [
  { key: "name" as keyof Ingredient, label: "Name" },
  { key: "category" as keyof Ingredient, label: "Category" },
  { key: "family" as keyof Ingredient, label: "Family" },
  { key: "status" as keyof Ingredient, label: "Status" },
  { key: "type" as keyof Ingredient, label: "Type" },
  { key: "supplier" as keyof Ingredient, label: "Supplier" },
  {
    key: "costPerKg" as keyof Ingredient,
    label: "Cost/kg",
    format: (value: any) => formatCurrency(value as number),
  },
  {
    key: "stock" as keyof Ingredient,
    label: "Stock",
    format: (value: any) => `${value} kg`,
  },
  { key: "casNumber" as keyof Ingredient, label: "CAS Number" },
  {
    key: "ifraLimitPct" as keyof Ingredient,
    label: "IFRA Limit",
    format: (value: any) => (value ? formatPercentage(value as number) : "N/A"),
  },
  {
    key: "allergens" as keyof Ingredient,
    label: "Allergens",
    format: (value: any) =>
      Array.isArray(value) ? value.join(", ") || "None" : "None",
  },
  {
    key: "updatedAt" as keyof Ingredient,
    label: "Updated",
    format: (value: any) => formatDate(value as string),
  },
];

export const CompareDialog: React.FC<CompareDialogProps> = ({
  ingredients,
  open,
  onOpenChange,
}) => {
  // Don't render if no ingredients or dialog is closed
  if (!open || !ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={modalStyles.overlay} />
        <Dialog.Content className={`${modalStyles.content} max-w-5xl`}>
          <div className={modalStyles.header}>
            <Dialog.Title className={modalStyles.title}>
              Compare Ingredients ({ingredients.length})
            </Dialog.Title>
            <Dialog.Description className={modalStyles.description}>
              Compare the selected ingredients side by side
            </Dialog.Description>
          </div>

          <div className={modalStyles.body}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  {ingredients.map((ingredient) => (
                    <th
                      key={ingredient.id}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="truncate" title={ingredient.name}>
                        {ingredient.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {compareFields.map((field) => (
                  <tr key={field.key} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      {field.label}
                    </td>
                    {ingredients.map((ingredient) => {
                      const value = ingredient[field.key];
                      const displayValue = field.format
                        ? field.format(value)
                        : value ?? "N/A";

                      return (
                        <td
                          key={`${ingredient.id}-${field.key}`}
                          className="px-3 py-2 text-sm text-gray-500"
                        >
                          <div
                            className="max-w-xs truncate"
                            title={String(displayValue)}
                          >
                            {String(displayValue)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={modalStyles.footer}>
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Close
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button className={modalStyles.closeButton} aria-label="Close">
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
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
