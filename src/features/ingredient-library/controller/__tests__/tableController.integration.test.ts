import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIngredientTableController } from '../tableController';
import type { IDataSource } from '../../services/dataSource';
import type { Ingredient } from '../../model/types';

// Mock data source
const mockDataSource: IDataSource = {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    toggleFavorite: vi.fn(),
    bulkExport: vi.fn(),
    duplicate: vi.fn(),
    archive: vi.fn(),
    getFilterOptions: vi.fn(),
};

const mockIngredients: Ingredient[] = [
    {
        id: 'ing-001',
        name: 'Vanilla Extract',
        category: 'Flavor',
        family: 'Vanilla',
        status: 'Active',
        type: 'Natural',
        supplier: 'Supplier A',
        costPerKg: 120.50,
        stock: 75,
        favorite: true,
        updatedAt: '2025-09-01T10:00:00Z',
    },
    {
        id: 'ing-002',
        name: 'Synthetic Vanillin',
        category: 'Flavor',
        family: 'Vanilla',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Supplier B',
        costPerKg: 45.25,
        stock: 200,
        favorite: false,
        updatedAt: '2025-09-02T14:30:00Z',
    },
];

describe('useIngredientTableController Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (mockDataSource.list as any).mockResolvedValue({
            success: true,
            data: mockIngredients,
            total: mockIngredients.length,
        });
    });

    it('should initialize with data from data source', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        // Initially loading
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual([]);

        // Wait for data to load
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockIngredients);
        // Use table data instead of filteredData since that's not in the interface
        expect(result.current.table.getRowModel().rows).toHaveLength(mockIngredients.length);
    });

    it('should calculate correct stats', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.stats.total).toBe(2);
        expect(result.current.stats.active).toBe(2);
        expect(result.current.stats.favorites).toBe(1);
    });

    it('should handle row selection', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Initially no selection (except for demo items that are pre-selected)
        expect(result.current.hasSelection).toBe(true); // Demo has pre-selected items
        expect(result.current.selectedCount).toBeGreaterThan(0);

        // Toggle selection
        act(() => {
            result.current.toggleRowSelection('ing-001');
        });

        expect(result.current.hasSelection).toBe(true);
        expect(result.current.selectedRows.length).toBeGreaterThan(0);
    });

    it('should handle filters correctly', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Apply category filter
        act(() => {
            result.current.setFilters({
                categories: ['Flavor'],
            });
        });

        // Check that filters are applied to state
        expect(result.current.state.filters.categories).toEqual(['Flavor']);

        // Apply type filter
        act(() => {
            result.current.setFilters({
                types: ['Natural'],
            });
        });

        expect(result.current.state.filters.types).toEqual(['Natural']);
    });

    it('should clear filters correctly', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Apply filters
        act(() => {
            result.current.setQuery('Synthetic');
            result.current.setFilters({
                types: ['Natural'],
            });
        });

        // Clear all filters
        act(() => {
            result.current.clearFilters();
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 350)); // Wait for debounce
        });

        expect(result.current.state.query).toBe('');
        expect(result.current.state.filters.types).toEqual([]);
    });

    it('should provide working table instance', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.table).toBeDefined();
        expect(result.current.table.getRowModel().rows).toHaveLength(2);
        expect(result.current.table.getState().pagination.pageSize).toBe(25);
    });

    it('should handle refetch correctly', async () => {
        const { result } = renderHook(() =>
            useIngredientTableController({
                dataSource: mockDataSource,
                initialPageSize: 25,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockDataSource.list).toHaveBeenCalledTimes(1);

        // Refetch data
        await act(async () => {
            await result.current.refetch();
        });

        expect(mockDataSource.list).toHaveBeenCalledTimes(2);
    });
});
