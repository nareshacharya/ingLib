import { describe, it, expect } from 'vitest';
import {
    applyFilters,
    getFilterOptions,
    createEmptyFiltersState,
    hasActiveFilters,
    getActiveFilterChips,
    removeFilterValue,
    clearAllFilters,
    DEFAULT_FILTERS
} from '../filterBuilder';
import type { Ingredient, FiltersState } from '../../model/types';

// Mock data for testing
const mockIngredients: Ingredient[] = [
    {
        id: 'ing-001',
        name: 'Rose Oil',
        category: 'Floral',
        family: 'Rose',
        status: 'Active',
        type: 'Natural',
        supplier: 'Supplier A',
        costPerKg: 150,
        stock: 25,
        favorite: true,
        casNumber: '8007-01-0',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 'ing-002',
        name: 'Vanillin',
        category: 'Sweet',
        family: 'Vanilla',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Supplier B',
        costPerKg: 75,
        stock: 200,
        favorite: false,
        casNumber: '121-33-5',
        updatedAt: '2024-01-02T00:00:00Z'
    },
    {
        id: 'ing-003',
        name: 'Lavender Oil',
        category: 'Floral',
        family: 'Lavender',
        status: 'Inactive',
        type: 'Natural',
        supplier: 'Supplier A',
        costPerKg: 120,
        stock: 0,
        favorite: true,
        casNumber: '8000-28-0',
        updatedAt: '2024-01-03T00:00:00Z'
    },
    {
        id: 'ing-004',
        name: 'Benzyl Acetate',
        category: 'Fruity',
        family: 'Ester',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Supplier C',
        costPerKg: 45,
        stock: 100,
        favorite: false,
        casNumber: '140-11-4',
        updatedAt: '2024-01-04T00:00:00Z'
    }
];

describe('filterBuilder', () => {
    describe('applyFilters', () => {
        it('should return all data when no filters are active', () => {
            const filters = createEmptyFiltersState();
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toEqual(mockIngredients);
        });

        it('should filter by search term', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                search: 'rose'
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Rose Oil');
        });

        it('should filter by search in CAS number', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                search: '121-33-5'
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Vanillin');
        });

        it('should filter by search in supplier', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                search: 'Supplier A'
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(2);
            expect(result.every(item => item.supplier === 'Supplier A')).toBe(true);
        });

        it('should filter by categories (multiselect)', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['Floral']
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(2);
            expect(result.every(item => item.category === 'Floral')).toBe(true);
        });

        it('should filter by multiple categories', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['Floral', 'Sweet']
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(3);
        });

        it('should filter by status', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                statuses: ['Active']
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(3);
            expect(result.every(item => item.status === 'Active')).toBe(true);
        });

        it('should filter by type', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                types: ['Natural']
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(2);
            expect(result.every(item => item.type === 'Natural')).toBe(true);
        });

        it('should filter by stock levels', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                stockLevels: ['High'] // 200+ kg
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(1);
            expect(result[0].stock).toBe(200);
        });

        it('should filter by multiple stock levels', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                stockLevels: ['Low', 'OutOfStock'] // 1-49 kg and 0 kg
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(2);
            expect(result.some(item => item.stock === 25)).toBe(true);
            expect(result.some(item => item.stock === 0)).toBe(true);
        });

        it('should filter by favorites only', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                favoritesOnly: true
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(2);
            expect(result.every(item => item.favorite === true)).toBe(true);
        });

        it('should filter by cost range', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                costRange: { min: 100, max: 200 }
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(2);
            expect(result.every(item => item.costPerKg >= 100 && item.costPerKg <= 200)).toBe(true);
        });

        it('should filter by stock range', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                stockRange: { min: 50, max: 150 }
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(1);
            expect(result[0].stock).toBe(100);
        });

        it('should combine multiple filters (AND logic)', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['Floral'],
                types: ['Natural'],
                statuses: ['Active']
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Rose Oil');
        });

        it('should return empty array when no items match filters', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['NonExistent']
            };
            const result = applyFilters(mockIngredients, DEFAULT_FILTERS, filters);
            expect(result).toHaveLength(0);
        });
    });

    describe('getFilterOptions', () => {
        it('should extract unique categories', () => {
            const options = getFilterOptions(mockIngredients);
            expect(options.categories).toEqual([
                { value: 'Floral', labelKey: 'Floral' },
                { value: 'Fruity', labelKey: 'Fruity' },
                { value: 'Sweet', labelKey: 'Sweet' }
            ]);
        });

        it('should extract unique suppliers', () => {
            const options = getFilterOptions(mockIngredients);
            expect(options.suppliers).toEqual([
                { value: 'Supplier A', labelKey: 'Supplier A' },
                { value: 'Supplier B', labelKey: 'Supplier B' },
                { value: 'Supplier C', labelKey: 'Supplier C' }
            ]);
        });

        it('should extract unique families', () => {
            const options = getFilterOptions(mockIngredients);
            expect(options.families).toEqual([
                { value: 'Ester', labelKey: 'Ester' },
                { value: 'Lavender', labelKey: 'Lavender' },
                { value: 'Rose', labelKey: 'Rose' },
                { value: 'Vanilla', labelKey: 'Vanilla' }
            ]);
        });
    });

    describe('hasActiveFilters', () => {
        it('should return false for empty filter state', () => {
            const filters = createEmptyFiltersState();
            expect(hasActiveFilters(filters)).toBe(false);
        });

        it('should return true for active search', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                search: 'test'
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return true for active array filters', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['Floral']
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return true for active boolean filters', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                favoritesOnly: true
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return true for active range filters', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                costRange: { min: 50 }
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return false for empty array filters', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: []
            };
            expect(hasActiveFilters(filters)).toBe(false);
        });
    });

    describe('getActiveFilterChips', () => {
        it('should return empty array for no active filters', () => {
            const filters = createEmptyFiltersState();
            const chips = getActiveFilterChips(filters, DEFAULT_FILTERS);
            expect(chips).toEqual([]);
        });

        it('should create chip for search filter', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                search: 'test search'
            };
            const chips = getActiveFilterChips(filters, DEFAULT_FILTERS);
            expect(chips).toHaveLength(1);
            expect(chips[0]).toEqual({
                id: 'search',
                label: 'Search',
                value: '"test search"',
                removable: true
            });
        });

        it('should create chips for multiselect filters', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['Floral', 'Sweet']
            };
            const chips = getActiveFilterChips(filters, DEFAULT_FILTERS);
            expect(chips).toHaveLength(2);
            expect(chips[0].label).toBe('Categories');
            expect(chips[0].value).toBe('Floral');
            expect(chips[1].value).toBe('Sweet');
        });

        it('should create chip for boolean filter', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                favoritesOnly: true
            };
            const chips = getActiveFilterChips(filters, DEFAULT_FILTERS);
            expect(chips).toHaveLength(1);
            expect(chips[0]).toEqual({
                id: 'favoritesOnly',
                label: 'FavoritesOnly',
                value: 'On',
                removable: true
            });
        });

        it('should create chip for range filter', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                costRange: { min: 50, max: 100 }
            };
            const chips = getActiveFilterChips(filters, DEFAULT_FILTERS);
            expect(chips).toHaveLength(1);
            expect(chips[0].value).toBe('50 - 100');
        });
    });

    describe('removeFilterValue', () => {
        it('should remove specific value from multiselect filter', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                categories: ['Floral', 'Sweet']
            };
            const result = removeFilterValue(filters, 'categories', 'Floral');
            expect(result.categories).toEqual(['Sweet']);
        });

        it('should clear entire filter when no specific value provided', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                search: 'test'
            };
            const result = removeFilterValue(filters, 'search');
            expect(result.search).toBe('');
        });

        it('should clear boolean filter', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                favoritesOnly: true
            };
            const result = removeFilterValue(filters, 'favoritesOnly');
            expect(result.favoritesOnly).toBe(false);
        });

        it('should clear range filter', () => {
            const filters: FiltersState = {
                ...createEmptyFiltersState(),
                costRange: { min: 50, max: 100 }
            };
            const result = removeFilterValue(filters, 'costRange');
            expect(result.costRange).toBeUndefined();
        });
    });

    describe('clearAllFilters', () => {
        it('should reset all filters to empty state', () => {
            const result = clearAllFilters();
            const expected = createEmptyFiltersState();
            expect(result).toEqual(expected);
        });
    });
});
