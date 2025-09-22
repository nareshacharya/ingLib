import React from "react";
import type { Ingredient } from "../../model/types";
import { Modal } from "./Modal";
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
    format: (value: unknown) => formatCurrency(value as number),
  },
  {
    key: "stock" as keyof Ingredient,
    label: "Stock",
    format: (value: unknown) => `${value} kg`,
  },
  { key: "casNumber" as keyof Ingredient, label: "CAS Number" },
  {
    key: "ifraLimitPct" as keyof Ingredient,
    label: "IFRA Limit",
    format: (value: unknown) => (value ? formatPercentage(value as number) : "N/A"),
  },
  {
    key: "allergens" as keyof Ingredient,
    label: "Allergens",
    format: (value: unknown) =>
      Array.isArray(value) ? value.join(", ") || "None" : "None",
  },
  {
    key: "updatedAt" as keyof Ingredient,
    label: "Updated",
    format: (value: unknown) => formatDate(value as string),
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

  const modalIcon = (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 00-2 2H9z" />
    </svg>
  );

  const footerActions = (
    <button 
      onClick={() => onOpenChange(false)}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      Close
    </button>
  );

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={`Compare Ingredients (${ingredients.length})`}
      subtitle="Compare the selected ingredients side by side"
      size="5xl"
      icon={modalIcon}
      showFooter={true}
      footerActions={footerActions}
    >
      <div className="overflow-x-auto">
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
    </Modal>
  );
};
