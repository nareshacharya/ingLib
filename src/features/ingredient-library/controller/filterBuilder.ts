import type {
    FilterDef,
    FiltersState,
    Ingredient,
    IngredientStatus,
    IngredientType,
    StockLevel
} from '../model/types';

// Stock level mappings
const STOCK_LEVEL_RANGES = {
    High: { min: 200, max: Infinity },
    Medium: { min: 50, max: 199 },
    Low: { min: 1, max: 49 },
    OutOfStock: { min: 0, max: 0 }
} as const;

// Filter definitions with predicates
export const DEFAULT_FILTERS: FilterDef[] = [
    {
        id: 'search',
        labelKey: 'Search',
        kind: 'text',
        placeholder: 'Search by name, CAS number, or supplier...',
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!value || typeof value !== 'string' || value.trim() === '') return true;

            const searchTerm = value.toLowerCase().trim();
            const searchableFields = [
                row.name,
                row.casNumber || '',
                row.supplier,
                row.category,
                row.family
            ];

            return searchableFields.some(field =>
                field.toLowerCase().includes(searchTerm)
            );
        }
    },

    {
        id: 'categories',
        labelKey: 'Category',
        kind: 'multiselect',
        options: [], // Will be populated dynamically
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!Array.isArray(value) || value.length === 0) return true;
            return value.includes(row.category);
        }
    },

    {
        id: 'statuses',
        labelKey: 'Status',
        kind: 'multiselect',
        options: [
            { value: 'Active' as IngredientStatus, labelKey: 'Active' },
            { value: 'Inactive' as IngredientStatus, labelKey: 'Inactive' }
        ],
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!Array.isArray(value) || value.length === 0) return true;
            return value.includes(row.status);
        }
    },

    {
        id: 'types',
        labelKey: 'Type',
        kind: 'multiselect',
        options: [
            { value: 'Natural' as IngredientType, labelKey: 'Natural' },
            { value: 'Synthetic' as IngredientType, labelKey: 'Synthetic' }
        ],
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!Array.isArray(value) || value.length === 0) return true;
            return value.includes(row.type);
        }
    },

    {
        id: 'suppliers',
        labelKey: 'Supplier',
        kind: 'multiselect',
        options: [], // Will be populated dynamically
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!Array.isArray(value) || value.length === 0) return true;
            return value.includes(row.supplier);
        }
    },

    {
        id: 'stockLevels',
        labelKey: 'Stock Level',
        kind: 'multiselect',
        options: [
            { value: 'High' as StockLevel, labelKey: 'High (200+ kg)' },
            { value: 'Medium' as StockLevel, labelKey: 'Medium (50-199 kg)' },
            { value: 'Low' as StockLevel, labelKey: 'Low (1-49 kg)' },
            { value: 'OutOfStock' as StockLevel, labelKey: 'Out of Stock' }
        ],
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!Array.isArray(value) || value.length === 0) return true;

            return value.some((level: StockLevel) => {
                const range = STOCK_LEVEL_RANGES[level];
                return row.stock >= range.min && row.stock <= range.max;
            });
        }
    },

    {
        id: 'favoritesOnly',
        labelKey: 'Favorites Only',
        kind: 'switch',
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!value) return true;
            return row.favorite === true;
        }
    },

    {
        id: 'costRange',
        labelKey: 'Cost Range ($/kg)',
        kind: 'range',
        min: 0,
        max: 1000,
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!value || typeof value !== 'object') return true;

            const range = value as { min?: number; max?: number };
            if (range.min !== undefined && row.costPerKg < range.min) return false;
            if (range.max !== undefined && row.costPerKg > range.max) return false;

            return true;
        }
    },

    {
        id: 'stockRange',
        labelKey: 'Stock Range (kg)',
        kind: 'range',
        min: 0,
        max: 1000,
        getPredicate: (value: unknown) => (row: Ingredient) => {
            if (!value || typeof value !== 'object') return true;

            const range = value as { min?: number; max?: number };
            if (range.min !== undefined && row.stock < range.min) return false;
            if (range.max !== undefined && row.stock > range.max) return false;

            return true;
        }
    }
];

/**
 * Apply all active filters to the provided data
 */
export function applyFilters(
    data: Ingredient[],
    filterDefs: FilterDef[],
    filtersState: FiltersState
): Ingredient[] {
    return data.filter(row => {
        return filterDefs.every(filterDef => {
            const filterValue = filtersState[filterDef.id];

            // Skip if no predicate defined
            if (!filterDef.getPredicate) return true;

            // Apply the filter predicate
            const predicate = filterDef.getPredicate(filterValue);
            return predicate(row);
        });
    });
}

/**
 * Get unique values for dynamic filter options
 */
export function getFilterOptions(data: Ingredient[]): Record<string, Array<{ value: string; labelKey: string }>> {
    const categories = [...new Set(data.map(item => item.category))].sort();
    const suppliers = [...new Set(data.map(item => item.supplier))].sort();
    const families = [...new Set(data.map(item => item.family))].sort();

    return {
        categories: categories.map(cat => ({ value: cat, labelKey: cat })),
        suppliers: suppliers.map(sup => ({ value: sup, labelKey: sup })),
        families: families.map(fam => ({ value: fam, labelKey: fam }))
    };
}

/**
 * Get filter definitions with dynamic options populated
 */
export function getFilterDefsWithOptions(data: Ingredient[]): FilterDef[] {
    const options = getFilterOptions(data);

    return DEFAULT_FILTERS.map(filterDef => {
        if (filterDef.id === 'categories') {
            return { ...filterDef, options: options.categories };
        }
        if (filterDef.id === 'suppliers') {
            return { ...filterDef, options: options.suppliers };
        }
        return filterDef;
    });
}

/**
 * Create an empty filters state with default values
 */
export function createEmptyFiltersState(): FiltersState {
    return {
        search: '',
        categories: [],
        statuses: [],
        types: [],
        suppliers: [],
        stockLevels: [],
        favoritesOnly: false,
        costRange: undefined,
        stockRange: undefined
    };
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filtersState: FiltersState): boolean {
    return Object.entries(filtersState).some(([key, value]) => {
        if (key === 'search') {
            return typeof value === 'string' && value.trim() !== '';
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (typeof value === 'boolean') {
            return value === true;
        }
        if (typeof value === 'object' && value !== null) {
            const range = value as { min?: number; max?: number };
            return range.min !== undefined || range.max !== undefined;
        }
        return false;
    });
}

/**
 * Get active filter chips for display
 */
export function getActiveFilterChips(
    filtersState: FiltersState,
    filterDefs: FilterDef[]
): Array<{ id: string; label: string; value: string; removable: boolean }> {
    const chips: Array<{ id: string; label: string; value: string; removable: boolean }> = [];

    filterDefs.forEach(filterDef => {
        const value = filtersState[filterDef.id];

        if (filterDef.kind === 'text' && typeof value === 'string' && value.trim() !== '') {
            chips.push({
                id: filterDef.id,
                label: filterDef.labelKey,
                value: `"${value}"`,
                removable: true
            });
        }

        if (filterDef.kind === 'multiselect' && Array.isArray(value) && value.length > 0) {
            value.forEach((item: any) => {
                const option = filterDef.options?.find(opt => opt.value === item);
                chips.push({
                    id: filterDef.id,
                    label: filterDef.labelKey,
                    value: option?.labelKey || String(item),
                    removable: true
                });
            });
        }

        if (filterDef.kind === 'switch' && value === true) {
            chips.push({
                id: filterDef.id,
                label: filterDef.labelKey,
                value: 'On',
                removable: true
            });
        }

        if (filterDef.kind === 'range' && value && typeof value === 'object') {
            const range = value as { min?: number; max?: number };
            if (range.min !== undefined || range.max !== undefined) {
                let rangeText = '';
                if (range.min !== undefined && range.max !== undefined) {
                    rangeText = `${range.min} - ${range.max}`;
                } else if (range.min !== undefined) {
                    rangeText = `≥ ${range.min}`;
                } else if (range.max !== undefined) {
                    rangeText = `≤ ${range.max}`;
                }

                chips.push({
                    id: filterDef.id,
                    label: filterDef.labelKey,
                    value: rangeText,
                    removable: true
                });
            }
        }
    });

    return chips;
}

/**
 * Remove a specific filter value
 */
export function removeFilterValue(
    filtersState: FiltersState,
    filterId: string,
    valueToRemove?: string
): FiltersState {
    const newState = { ...filtersState };

    if (valueToRemove) {
        // Remove specific value from multiselect
        const currentValue = newState[filterId];
        if (Array.isArray(currentValue)) {
            newState[filterId] = currentValue.filter(item => item !== valueToRemove);
        }
    } else {
        // Clear entire filter
        const filterDef = DEFAULT_FILTERS.find(f => f.id === filterId);
        if (filterDef) {
            switch (filterDef.kind) {
                case 'text':
                    newState[filterId] = '';
                    break;
                case 'multiselect':
                    newState[filterId] = [];
                    break;
                case 'switch':
                    newState[filterId] = false;
                    break;
                case 'range':
                    newState[filterId] = undefined;
                    break;
                default:
                    newState[filterId] = undefined;
            }
        }
    }

    return newState;
}

/**
 * Clear all filters
 */
export function clearAllFilters(): FiltersState {
    return createEmptyFiltersState();
}
