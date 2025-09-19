import type { Ingredient, IngredientFilters, StockLevel, GroupedIngredient } from '../model/types';

/**
 * Filter ingredients based on search query and filters
 */
export function filterRows(
    ingredients: Ingredient[],
    filters: Partial<IngredientFilters>
): Ingredient[] {
    let filtered = [...ingredients];

    // Search filter
    if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        filtered = filtered.filter(ingredient =>
            ingredient.name.toLowerCase().includes(searchTerm) ||
            ingredient.category.toLowerCase().includes(searchTerm) ||
            ingredient.family.toLowerCase().includes(searchTerm) ||
            ingredient.supplier.toLowerCase().includes(searchTerm) ||
            ingredient.casNumber?.toLowerCase().includes(searchTerm) ||
            ingredient.allergens?.some(a => a.toLowerCase().includes(searchTerm))
        );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(ingredient =>
            filters.categories!.includes(ingredient.category)
        );
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
        filtered = filtered.filter(ingredient =>
            filters.statuses!.includes(ingredient.status)
        );
    }

    // Type filter
    if (filters.types && filters.types.length > 0) {
        filtered = filtered.filter(ingredient =>
            filters.types!.includes(ingredient.type)
        );
    }

    // Supplier filter
    if (filters.suppliers && filters.suppliers.length > 0) {
        filtered = filtered.filter(ingredient =>
            filters.suppliers!.includes(ingredient.supplier)
        );
    }

    // Stock level filter
    if (filters.stockLevels && filters.stockLevels.length > 0) {
        filtered = filtered.filter(ingredient => {
            const stockLevel = getStockLevel(ingredient.stock);
            return filters.stockLevels!.includes(stockLevel);
        });
    }

    // Favorites filter
    if (filters.favoritesOnly) {
        filtered = filtered.filter(ingredient => ingredient.favorite);
    }

    return filtered;
}

/**
 * Group ingredients by specified field
 */
export function groupRows(
    ingredients: Ingredient[],
    groupBy: 'family' | 'supplier' | 'none'
): GroupedIngredient[] {
    if (groupBy === 'none') {
        return ingredients.map(ing => ({ ...ing }));
    }

    const grouped: Record<string, Ingredient[]> = {};

    ingredients.forEach(ingredient => {
        const groupKey = ingredient[groupBy];
        if (!grouped[groupKey]) {
            grouped[groupKey] = [];
        }
        grouped[groupKey].push(ingredient);
    });

    const result: GroupedIngredient[] = [];

    Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([groupKey, groupIngredients]) => {
            // Add group header
            result.push({
                ...groupIngredients[0], // Use first ingredient as template
                id: `group-${groupKey}`,
                name: groupKey,
                groupKey,
                groupLabel: groupKey,
                isGroupHeader: true,
                level: 0
            });

            // Add group items
            groupIngredients.forEach(ingredient => {
                result.push({
                    ...ingredient,
                    groupKey,
                    level: 1
                });
            });
        });

    return result;
}

/**
 * Build hierarchical structure from flat data using parentId
 */
export function buildHierarchy(ingredients: Ingredient[]): Ingredient[] {
    const itemMap = new Map<string, Ingredient & { children?: Ingredient[] }>();
    const roots: Ingredient[] = [];

    // First pass: create map and initialize children arrays
    ingredients.forEach(ingredient => {
        itemMap.set(ingredient.id, { ...ingredient, children: [] });
    });

    // Second pass: build hierarchy
    ingredients.forEach(ingredient => {
        const item = itemMap.get(ingredient.id)!;

        if (ingredient.parentId && itemMap.has(ingredient.parentId)) {
            const parent = itemMap.get(ingredient.parentId)!;
            parent.children!.push(item);
        } else {
            roots.push(item);
        }
    });

    // Flatten hierarchy with level information
    function flattenWithLevel(items: (Ingredient & { children?: Ingredient[] })[], level = 0): Ingredient[] {
        const result: Ingredient[] = [];

        items.forEach(item => {
            const { children, ...ingredient } = item;
            result.push(ingredient);

            if (children && children.length > 0) {
                result.push(...flattenWithLevel(children, level + 1));
            }
        });

        return result;
    }

    return flattenWithLevel(roots);
}

/**
 * Get selected rows from selection state
 */
export function selectedRows(
    ingredients: Ingredient[],
    selection: Record<string, boolean>
): Ingredient[] {
    return ingredients.filter(ingredient => selection[ingredient.id]);
}

/**
 * Get stock level based on stock amount
 */
export function getStockLevel(stock: number): StockLevel {
    if (stock === 0) return 'OutOfStock';
    if (stock < 50) return 'Low';
    if (stock < 150) return 'Medium';
    return 'High';
}

/**
 * Export data to CSV format
 */
export function exportToCSV(
    ingredients: Ingredient[],
    columns: string[] = ['name', 'category', 'family', 'status', 'type', 'supplier', 'costPerKg', 'stock']
): string {
    const headers = columns.map(formatColumnHeader).join(',');

    const rows = ingredients.map(ingredient =>
        columns.map(column => {
            const value = (ingredient as any)[column];

            if (Array.isArray(value)) {
                return `"${value.join('; ')}"`;
            }

            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }

            return value ?? '';
        }).join(',')
    );

    return [headers, ...rows].join('\n');
}

/**
 * Export data to JSON format
 */
export function exportToJSON(ingredients: Ingredient[]): string {
    return JSON.stringify(ingredients, null, 2);
}

/**
 * Format column header for export
 */
function formatColumnHeader(column: string): string {
    const headerMap: Record<string, string> = {
        name: 'Name',
        category: 'Category',
        family: 'Family',
        status: 'Status',
        type: 'Type',
        supplier: 'Supplier',
        costPerKg: 'Cost per Kg',
        stock: 'Stock',
        favorite: 'Favorite',
        casNumber: 'CAS Number',
        ifraLimitPct: 'IFRA Limit %',
        allergens: 'Allergens',
        updatedAt: 'Updated At'
    };

    return headerMap[column] || column;
}

/**
 * Calculate statistics from ingredients
 */
export function calculateStats(ingredients: Ingredient[]) {
    const total = ingredients.length;
    const active = ingredients.filter(ing => ing.status === 'Active').length;
    const lowStock = ingredients.filter(ing => getStockLevel(ing.stock) === 'Low').length;
    const favorites = ingredients.filter(ing => ing.favorite).length;

    return {
        total,
        active,
        lowStock,
        favorites
    };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number): string {
    return `${value}%`;
}

/**
 * Format date value
 */
export function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(dateString));
}

/**
 * Format stock value with units
 */
export function formatStock(value: number): string {
    return `${value} kg`;
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Check if two filter objects are equal
 */
export function filtersEqual(
    a: Partial<IngredientFilters>,
    b: Partial<IngredientFilters>
): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Get unique values from array
 */
export function getUniqueValues<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}
