import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { viewStore, createDefaultView, isViewModified, DEFAULT_COLUMNS } from '../../services/viewStore';
import type { SavedView, GroupKey } from '../../model/types';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

// Mock global localStorage
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('viewStore', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    afterEach(() => {
        localStorageMock.clear();
    });

    describe('createView', () => {
        it('should create a new view with generated ID and timestamps', async () => {
            const viewData = {
                name: 'Test View',
                query: 'test search',
                filters: { search: 'test', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            };

            const result = await viewStore.createView(viewData);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data!.id).toMatch(/^view-/);
            expect(result.data!.name).toBe('Test View');
            expect(result.data!.createdAt).toBeDefined();
            expect(result.data!.updatedAt).toBeDefined();
        });

        it('should store view in localStorage', async () => {
            const viewData = {
                name: 'Test View',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            };

            await viewStore.createView(viewData);

            const stored = localStorage.getItem('ingredient-library-views');
            expect(stored).toBeDefined();
            const views = JSON.parse(stored!);
            expect(views).toHaveLength(1);
            expect(views[0].name).toBe('Test View');
        });
    });

    describe('listViews', () => {
        it('should return empty array when no views exist', async () => {
            const result = await viewStore.listViews();
            expect(result.success).toBe(true);
            expect(result.data).toEqual([]);
        });

        it('should return all stored views', async () => {
            // Create two views
            await viewStore.createView({
                name: 'View 1',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            });

            await viewStore.createView({
                name: 'View 2',
                query: 'search',
                filters: { search: 'search', categories: ['Floral'], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: 'category',
                sortBy: { id: 'name', desc: false },
            });

            const result = await viewStore.listViews();
            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(2);
            expect(result.data![0].name).toBe('View 1');
            expect(result.data![1].name).toBe('View 2');
        });
    });

    describe('updateView', () => {
        it('should update existing view', async () => {
            // Create a view first
            const createResult = await viewStore.createView({
                name: 'Original Name',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            });

            const view = createResult.data!;
            const updatedView: SavedView = {
                ...view,
                name: 'Updated Name',
                query: 'new search',
            };

            const updateResult = await viewStore.updateView(updatedView);

            expect(updateResult.success).toBe(true);
            expect(updateResult.data!.name).toBe('Updated Name');
            expect(updateResult.data!.query).toBe('new search');
            expect(updateResult.data!.updatedAt).not.toBe(view.updatedAt);
        });

        it('should return error for non-existent view', async () => {
            const fakeView: SavedView = {
                id: 'non-existent',
                name: 'Fake',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const result = await viewStore.updateView(fakeView);
            expect(result.success).toBe(false);
            expect(result.error).toBe('View not found');
        });
    });

    describe('deleteView', () => {
        it('should delete existing view', async () => {
            // Create a view first
            const createResult = await viewStore.createView({
                name: 'To Delete',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            });

            const viewId = createResult.data!.id;

            const deleteResult = await viewStore.deleteView(viewId);
            expect(deleteResult.success).toBe(true);

            // Verify it's gone
            const listResult = await viewStore.listViews();
            expect(listResult.data).toHaveLength(0);
        });

        it('should return error for non-existent view', async () => {
            const result = await viewStore.deleteView('non-existent');
            expect(result.success).toBe(false);
            expect(result.error).toBe('View not found');
        });

        it('should clear default view reference when default view is deleted', async () => {
            // Create and set as default
            const createResult = await viewStore.createView({
                name: 'Default View',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            });

            const viewId = createResult.data!.id;
            await viewStore.setDefaultView(viewId);

            // Verify it's set as default
            const defaultResult = await viewStore.getDefaultView();
            expect(defaultResult.data?.id).toBe(viewId);

            // Delete the view
            await viewStore.deleteView(viewId);

            // Verify default is cleared
            const defaultResult2 = await viewStore.getDefaultView();
            expect(defaultResult2.data).toBe(null);
        });
    });

    describe('default view management', () => {
        it('should set and get default view', async () => {
            // Create a view
            const createResult = await viewStore.createView({
                name: 'Default View',
                query: '',
                filters: { search: '', categories: [], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
                columns: DEFAULT_COLUMNS,
                groupBy: null,
                sortBy: null,
            });

            const viewId = createResult.data!.id;

            // Set as default
            const setResult = await viewStore.setDefaultView(viewId);
            expect(setResult.success).toBe(true);

            // Get default
            const getResult = await viewStore.getDefaultView();
            expect(getResult.success).toBe(true);
            expect(getResult.data?.id).toBe(viewId);
        });

        it('should return null when no default view is set', async () => {
            const result = await viewStore.getDefaultView();
            expect(result.success).toBe(true);
            expect(result.data).toBe(null);
        });

        it('should clear stale default view reference', async () => {
            // Set a non-existent view as default
            localStorage.setItem('ingredient-library-default-view', 'non-existent-id');

            const result = await viewStore.getDefaultView();
            expect(result.success).toBe(true);
            expect(result.data).toBe(null);

            // Should have cleared the stale reference
            expect(localStorage.getItem('ingredient-library-default-view')).toBe(null);
        });
    });

    describe('last used view management', () => {
        it('should set and get last used view', async () => {
            const viewId = 'test-view-id';

            const setResult = await viewStore.setLastUsedView(viewId);
            expect(setResult.success).toBe(true);

            const getResult = await viewStore.getLastUsedView();
            expect(getResult.success).toBe(true);
            expect(getResult.data).toBe(viewId);
        });

        it('should return null when no last used view is set', async () => {
            const result = await viewStore.getLastUsedView();
            expect(result.success).toBe(true);
            expect(result.data).toBe(null);
        });
    });
});

describe('createDefaultView', () => {
    it('should create a default view with correct structure', () => {
        const defaultView = createDefaultView();

        expect(defaultView.name).toBe('Default View');
        expect(defaultView.query).toBe('');
        expect(defaultView.filters).toBeDefined();
        expect(defaultView.columns).toEqual(DEFAULT_COLUMNS);
        expect(defaultView.groupBy).toBe(null);
        expect(defaultView.sortBy).toBe(null);
        expect(defaultView.isDefault).toBe(true);
    });
});

describe('isViewModified', () => {
    const baseView: SavedView = {
        id: 'test-view',
        name: 'Test View',
        query: 'test search',
        filters: { search: 'test search', categories: ['Floral'], statuses: [], types: [], suppliers: [], stockLevels: [], favoritesOnly: false },
        columns: DEFAULT_COLUMNS,
        groupBy: 'category',
        sortBy: { id: 'name', desc: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    it('should return false when state matches saved view', () => {
        const currentState = {
            query: baseView.query,
            filters: baseView.filters,
            columns: baseView.columns,
            groupBy: baseView.groupBy!,
            sortBy: baseView.sortBy ? [baseView.sortBy] : null,
        };

        expect(isViewModified(currentState, baseView)).toBe(false);
    });

    it('should return true when query differs', () => {
        const currentState = {
            query: 'different search',
            filters: baseView.filters,
            columns: baseView.columns,
            groupBy: baseView.groupBy,
            sortBy: baseView.sortBy ? [baseView.sortBy] : null,
        };

        expect(isViewModified(currentState, baseView)).toBe(true);
    });

    it('should return true when filters differ', () => {
        const currentState = {
            query: baseView.query,
            filters: { ...baseView.filters, categories: ['Sweet'] },
            columns: baseView.columns,
            groupBy: baseView.groupBy,
            sortBy: baseView.sortBy ? [baseView.sortBy] : null,
        };

        expect(isViewModified(currentState, baseView)).toBe(true);
    });

    it('should return true when groupBy differs', () => {
        const currentState = {
            query: baseView.query,
            filters: baseView.filters,
            columns: baseView.columns,
            groupBy: 'family' as const,
            sortBy: baseView.sortBy ? [baseView.sortBy] : null,
        };

        expect(isViewModified(currentState, baseView)).toBe(true);
    });

    it('should return true when sortBy differs', () => {
        const currentState = {
            query: baseView.query,
            filters: baseView.filters,
            columns: baseView.columns,
            groupBy: baseView.groupBy,
            sortBy: [{ id: 'category', desc: true }],
        };

        expect(isViewModified(currentState, baseView)).toBe(true);
    });

    it('should return true when columns differ', () => {
        const modifiedColumns = [...DEFAULT_COLUMNS];
        modifiedColumns[0] = { ...modifiedColumns[0], visible: false };

        const currentState = {
            query: baseView.query,
            filters: baseView.filters,
            columns: modifiedColumns,
            groupBy: baseView.groupBy,
            sortBy: baseView.sortBy ? [baseView.sortBy] : null,
        };

        expect(isViewModified(currentState, baseView)).toBe(true);
    });
});
