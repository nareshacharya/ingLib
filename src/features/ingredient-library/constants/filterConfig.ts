import React from "react";
import {
    categoryOptions,
    statusOptions,
    typeOptions,
    supplierOptions,
} from "./filterOptions";

/**
 * Filter Configuration Interface
 * Used to define which filters are available and how they should be rendered
 */
export interface FilterConfig {
    id: string; // Column ID that this filter targets
    label: string; // Display name for the filter
    icon: React.ReactElement; // Icon component to display
    type: 'checkbox' | 'multiselect'; // How the filter should be rendered
    options: { value: string; label: string }[]; // Available options for the filter
    enabled: boolean; // Whether this filter should be shown
}

/**
 * Configurable Filter Settings
 * 
 * To customize which filters are available:
 * 1. Set `enabled: false` to hide a filter
 * 2. Change `type` between 'checkbox' and 'multiselect'
 * 3. Add new filters by adding entries to this array
 * 4. The `id` field must match the column accessor key from the table
 */
export const FILTER_CONFIG: FilterConfig[] = [
    {
        id: 'category',
        label: 'Category',
        icon: `<svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-5v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2z"></path>
        </svg>`,
        type: 'checkbox', // Changed from 'multiselect' to match Status and Type
        options: categoryOptions,
        enabled: true
    },
    {
        id: 'status',
        label: 'Status',
        icon: `<svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        type: 'checkbox',
        options: statusOptions,
        enabled: true
    },
    {
        id: 'type',
        label: 'Type',
        icon: `<svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>`,
        type: 'checkbox',
        options: typeOptions,
        enabled: true
    },
    {
        id: 'supplier',
        label: 'Supplier',
        icon: `<svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>`,
        type: 'checkbox', // Changed from 'multiselect' to match Status and Type
        options: supplierOptions,
        enabled: true
    }
];

/**
 * Helper function to get enabled filters only
 */
export const getEnabledFilters = () => FILTER_CONFIG.filter(config => config.enabled);

/**
 * Helper function to get filter config by ID
 */
export const getFilterConfigById = (id: string) => FILTER_CONFIG.find(config => config.id === id);

/**
 * Helper function to check if a filter is enabled
 */
export const isFilterEnabled = (id: string) => {
    const config = getFilterConfigById(id);
    return config ? config.enabled : false;
};
