import { describe, it, expect } from 'vitest';
import {
    filterRows,
    calculateStats,
    exportToCSV,
    exportToJSON,
    getStockLevel,
    formatCurrency,
    formatDate,
    formatPercentage
} from '../controller/selectors';
import type { Ingredient, IngredientFilters } from '../model/types';

const mockIngredients: Ingredient[] = [
    {
        id: '1',
        name: 'Bergamot Essential Oil',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 125.50,
        stock: 150,
        favorite: true,
        casNumber: '8007-75-8',
        ifraLimitPct: 0.4,
        allergens: ['Limonene', 'Linalool'],
        updatedAt: '2024-03-15T10:30:00Z'
    },
    {
        id: '2',
        name: 'Vanillin',
        category: 'Aroma Chemicals',
        family: 'Vanilla',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Borregaard',
        costPerKg: 45.80,
        stock: 300,
        favorite: false,
        casNumber: '121-33-5',
        ifraLimitPct: 4.0,
        allergens: [],
        updatedAt: '2024-03-05T15:30:00Z'
    },
    {
        id: '3',
        name: 'Discontinued Oil',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Inactive',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 95.00,
        stock: 0,
        favorite: false,
        casNumber: '8000-00-0',
        ifraLimitPct: 1.0,
        allergens: ['Limonene'],
        updatedAt: '2024-01-15T10:30:00Z'
    }
];

describe('Ingredient Library Selectors', () => {
    describe('filterRows', () => {
        it('should filter by search term', () => {
            const filters: Partial<IngredientFilters> = {
                search: 'bergamot'
            };

            const result = filterRows(mockIngredients, filters);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Bergamot Essential Oil');
        });

        it('should filter by category', () => {
            const filters: Partial<IngredientFilters> = {
                categories: ['Essential Oils']
            };

            const result = filterRows(mockIngredients, filters);
            expect(result).toHaveLength(2);
            expect(result.every(ing => ing.category === 'Essential Oils')).toBe(true);
        });

        it('should filter by status', () => {
            const filters: Partial<IngredientFilters> = {
                statuses: ['Active']
            };

            const result = filterRows(mockIngredients, filters);
            expect(result).toHaveLength(2);
            expect(result.every(ing => ing.status === 'Active')).toBe(true);
        });

        it('should filter by type', () => {
            const filters: Partial<IngredientFilters> = {
                types: ['Synthetic']
            };

            const result = filterRows(mockIngredients, filters);
            expect(result).toHaveLength(1);
            expect(result[0].type).toBe('Synthetic');
        });

        it('should filter favorites only', () => {
            const filters: Partial<IngredientFilters> = {
                favoritesOnly: true
            };

            const result = filterRows(mockIngredients, filters);
            expect(result).toHaveLength(1);
            expect(result[0].favorite).toBe(true);
        });

        it('should combine multiple filters', () => {
            const filters: Partial<IngredientFilters> = {
                search: 'oil',
                statuses: ['Active'],
                favoritesOnly: true
            };

            const result = filterRows(mockIngredients, filters);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Bergamot Essential Oil');
        });
    });

    describe('calculateStats', () => {
        it('should calculate correct statistics', () => {
            const stats = calculateStats(mockIngredients);

            expect(stats.total).toBe(3);
            expect(stats.active).toBe(2);
            expect(stats.lowStock).toBe(1); // One item with 0 stock
            expect(stats.favorites).toBe(1);
        });

        it('should handle empty array', () => {
            const stats = calculateStats([]);

            expect(stats.total).toBe(0);
            expect(stats.active).toBe(0);
            expect(stats.lowStock).toBe(0);
            expect(stats.favorites).toBe(0);
        });
    });

    describe('getStockLevel', () => {
        it('should return correct stock levels', () => {
            expect(getStockLevel(0)).toBe('OutOfStock');
            expect(getStockLevel(25)).toBe('Low');
            expect(getStockLevel(100)).toBe('Medium');
            expect(getStockLevel(200)).toBe('High');
        });
    });

    describe('Export functions', () => {
        it('should export to CSV format', () => {
            const csv = exportToCSV(mockIngredients.slice(0, 2), ['name', 'category', 'costPerKg']);

            expect(csv).toContain('Name,Category,Cost per Kg');
            expect(csv).toContain('Bergamot Essential Oil,Essential Oils,125.5');
            expect(csv).toContain('Vanillin,Aroma Chemicals,45.8');
        });

        it('should export to JSON format', () => {
            const json = exportToJSON(mockIngredients.slice(0, 1));
            const parsed = JSON.parse(json);

            expect(Array.isArray(parsed)).toBe(true);
            expect(parsed[0].name).toBe('Bergamot Essential Oil');
            expect(parsed[0].costPerKg).toBe(125.50);
        });

        it('should handle CSV special characters', () => {
            const ingredientWithComma = {
                ...mockIngredients[0],
                name: 'Test, Ingredient'
            };

            const csv = exportToCSV([ingredientWithComma], ['name']);
            expect(csv).toContain('"Test, Ingredient"');
        });
    });

    describe('Format functions', () => {
        it('should format currency correctly', () => {
            expect(formatCurrency(125.50)).toBe('$125.50');
            expect(formatCurrency(1000)).toBe('$1,000.00');
        });

        it('should format percentage correctly', () => {
            expect(formatPercentage(0.4)).toBe('0.4%');
            expect(formatPercentage(25)).toBe('25%');
        });

        it('should format date correctly', () => {
            const result = formatDate('2024-03-15T10:30:00Z');
            expect(result).toMatch(/Mar 15, 2024/);
        });
    });
});
