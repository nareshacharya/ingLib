import React from 'react';
import type { Ingredient } from '../../model/types';
import { Modal } from './Modal';

interface IngredientDetailsModalProps {
  ingredient: Ingredient;
  isOpen: boolean;
  onClose: () => void;
}

export const IngredientDetailsModal: React.FC<IngredientDetailsModalProps> = ({
  ingredient,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Inactive': return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'Limited': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Natural': return 'text-green-700 bg-green-50 border-green-200';
      case 'Synthetic': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-700 bg-red-50 border-red-200';
    if (stock < 50) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (stock < 150) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  const modalIcon = (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  const footerActions = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Close
      </button>
      <button
        onClick={() => {
          // Could add edit functionality here
          // Edit ingredient functionality would go here
        }}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
      >
        Edit Ingredient
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ingredient.name}
      subtitle="Ingredient Details"
      size="4xl"
      icon={modalIcon}
      showFooter={true}
      footerActions={footerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">ID:</span>
              <span className="text-sm text-gray-900 font-mono">{ingredient.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Category:</span>
              <span className="text-sm text-gray-900">{ingredient.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Family:</span>
              <span className="text-sm text-gray-900">{ingredient.family}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Supplier:</span>
              <span className="text-sm text-gray-900">{ingredient.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">CAS Number:</span>
              <span className="text-sm text-gray-900 font-mono">{formatValue(ingredient.casNumber)}</span>
            </div>
          </div>
        </div>

        {/* Status & Properties */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Status & Properties
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ingredient.status)}`}>
                {ingredient.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Type:</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(ingredient.type)}`}>
                {ingredient.type}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Favorite:</span>
              <span className="text-sm text-gray-900">
                {ingredient.favorite ? (
                  <span className="text-yellow-500">★ Yes</span>
                ) : (
                  <span className="text-gray-400">☆ No</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Updated:</span>
              <span className="text-sm text-gray-900">
                {new Date(ingredient.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Financial Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Cost per Kg:</span>
              <span className="text-sm text-gray-900 font-medium">
                ${ingredient.costPerKg.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Stock:</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStockColor(ingredient.stock)}`}>
                {ingredient.stock}kg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Total Value:</span>
              <span className="text-sm text-gray-900 font-medium">
                ${(ingredient.costPerKg * ingredient.stock).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Safety & Compliance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Safety & Compliance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">IFRA Limit:</span>
              <span className="text-sm text-gray-900">
                {ingredient.ifraLimitPct ? `${ingredient.ifraLimitPct}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Allergens:</span>
              <div className="text-sm text-gray-900 text-right max-w-48">
                {ingredient.allergens && ingredient.allergens.length > 0 ? (
                  <div className="space-y-1">
                    {ingredient.allergens.map((allergen, index) => (
                      <span key={index} className="inline-block bg-red-50 text-red-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                        {allergen}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {ingredient.parentId && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Hierarchy Information</h3>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Parent ID:</span>
            <span className="text-sm text-gray-900 font-mono">{ingredient.parentId}</span>
          </div>
        </div>
      )}
    </Modal>
  );
};
