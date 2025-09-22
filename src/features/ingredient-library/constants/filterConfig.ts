import {
    categoryOptions,
    statusOptions,
    typeOptions,
    supplierOptions,
} from "./filterOptions";
import type { IconName } from "../theme/iconTypes";

/**
 * Filter Configuration Interface
 * Used to define which filters are available and how they should be rendered
 */
export type FilterType = "checkbox" | "multiselect" | "select" | "range" | "text" | "boolean";

export interface FilterConfig {
    id: string; // Column ID that this filter targets
    label: string; // Display name for the filter
    icon: IconName; // Icon component to display
    type: FilterType; // How the filter should be rendered
    options: { value: string; label: string }[]; // Available options for the filter
    enabled: boolean; // Whether this filter should be shown
    
    // Enhanced configuration options
    allowMultiple?: boolean; // For select/multiselect
    allowSearch?: boolean; // For multiselect
    minValue?: number; // For range filters
    maxValue?: number; // For range filters
    step?: number; // For range filters
    placeholder?: string; // For text filters
    defaultValue?: string | string[] | boolean; // Default value
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
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
        icon: 'flask', // Use flask icon for ingredient categories (chemistry/perfumery context)
        type: 'checkbox', // Changed from 'multiselect' to match Status and Type
        options: categoryOptions,
        enabled: true
    },
    {
        id: 'status',
        label: 'Status',
        icon: 'statusIcon', // Use status icon (checkmark in circle) for active/inactive status
        type: 'checkbox',
        options: statusOptions,
        enabled: true
    },
    {
        id: 'type',
        label: 'Type',
        icon: 'leaf', // Use leaf icon for natural vs synthetic (nature context)
        type: 'checkbox',
        options: typeOptions,
        enabled: true
    },
    {
        id: 'supplier',
        label: 'Supplier',
        icon: 'factory', // Use factory icon for suppliers (manufacturing context)
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
