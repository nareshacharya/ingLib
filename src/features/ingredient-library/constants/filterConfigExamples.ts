/**
 * Example Configuration Customizations
 * 
 * This file shows examples of how to customize the filter configuration
 * for different use cases. Copy the configurations you need to filterConfig.ts
 */

import React from "react";
import {
    categoryOptions,
    statusOptions,
    typeOptions,
    supplierOptions,
} from "./filterOptions";
import type { FilterConfig } from "./filterConfig";

// Example 1: Minimal Configuration - Only show Status and Type filters
export const MINIMAL_FILTER_CONFIG: FilterConfig[] = [
    {
        id: 'status',
        label: 'Status',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }, React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        })),
        type: 'checkbox',
        options: statusOptions,
        enabled: true
    },
    {
        id: 'type',
        label: 'Type',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }, React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        })),
        type: 'checkbox',
        options: typeOptions,
        enabled: true
    }
];

// Example 2: Mixed UI Types - Some checkbox, some multiselect
export const MIXED_FILTER_CONFIG: FilterConfig[] = [
    {
        id: 'category',
        label: 'Category',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }, React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M19 11H5m14-5v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2z"
        })),
        type: 'multiselect', // Using multiselect for categories
        options: categoryOptions,
        enabled: true
    },
    {
        id: 'status',
        label: 'Status',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }, React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        })),
        type: 'checkbox', // Using checkboxes for status
        options: statusOptions,
        enabled: true
    },
    {
        id: 'supplier',
        label: 'Supplier',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }, React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        })),
        type: 'multiselect', // Using multiselect for suppliers
        options: supplierOptions,
        enabled: true
    }
];

// Example 3: Disable Category and Supplier filters
export const LIMITED_FILTER_CONFIG: FilterConfig[] = [
    {
        id: 'category',
        label: 'Category',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }),
        type: 'checkbox',
        options: categoryOptions,
        enabled: false // Disabled
    },
    {
        id: 'status',
        label: 'Status',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }),
        type: 'checkbox',
        options: statusOptions,
        enabled: true
    },
    {
        id: 'type',
        label: 'Type',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }),
        type: 'checkbox',
        options: typeOptions,
        enabled: true
    },
    {
        id: 'supplier',
        label: 'Supplier',
        icon: React.createElement('svg', {
            className: "w-4 h-4 text-gray-500",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        }),
        type: 'checkbox',
        options: supplierOptions,
        enabled: false // Disabled
    }
];

/**
 * To use any of these configurations:
 * 
 * 1. Copy the desired configuration
 * 2. Replace the FILTER_CONFIG export in filterConfig.ts
 * 3. Save the file
 * 4. The changes will be applied automatically
 * 
 * Example:
 * // In filterConfig.ts
 * export const FILTER_CONFIG = MINIMAL_FILTER_CONFIG;
 */
