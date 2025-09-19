import type { SavedView, FiltersState, ColumnConfig, GroupKey, SortSpec } from '../model/types';

export interface ViewStoreResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface IViewStore {
    listViews(): Promise<ViewStoreResult<SavedView[]>>;
    createView(view: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>): Promise<ViewStoreResult<SavedView>>;
    updateView(view: SavedView): Promise<ViewStoreResult<SavedView>>;
    deleteView(id: string): Promise<ViewStoreResult>;
    getDefaultView(): Promise<ViewStoreResult<SavedView | null>>;
    setDefaultView(id: string): Promise<ViewStoreResult>;
    getLastUsedView(): Promise<ViewStoreResult<string | null>>;
    setLastUsedView(id: string): Promise<ViewStoreResult>;
}

// Default view configuration
export const DEFAULT_COLUMNS: ColumnConfig[] = [
    { key: 'select', visible: true, order: 0, width: 40 },
    { key: 'favorite', visible: true, order: 1, width: 80 },
    { key: 'name', visible: true, order: 2, width: 200 },
    { key: 'category', visible: true, order: 3, width: 150 },
    { key: 'family', visible: true, order: 4, width: 120 },
    { key: 'status', visible: true, order: 5, width: 100 },
    { key: 'type', visible: true, order: 6, width: 100 },
    { key: 'supplier', visible: true, order: 7, width: 120 },
    { key: 'costPerKg', visible: true, order: 8, width: 100 },
    { key: 'stock', visible: true, order: 9, width: 100 },
    { key: 'casNumber', visible: false, order: 10, width: 120 },
    { key: 'ifraLimitPct', visible: false, order: 11, width: 120 },
    { key: 'allergens', visible: false, order: 12, width: 150 },
    { key: 'updatedAt', visible: false, order: 13, width: 120 },
    { key: 'actions', visible: true, order: 14, width: 60 },
];

export const DEFAULT_FILTERS: FiltersState = {
    search: '',
    categories: [],
    statuses: [],
    types: [],
    suppliers: [],
    stockLevels: [],
    favoritesOnly: false,
};

class LocalStorageViewStore implements IViewStore {
    private readonly VIEWS_KEY = 'ingredient-library-views';
    private readonly DEFAULT_VIEW_KEY = 'ingredient-library-default-view';
    private readonly LAST_USED_VIEW_KEY = 'ingredient-library-last-used-view';

    private async delay(ms: number = 10): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateId(): string {
        return 'view-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    private getStoredViews(): SavedView[] {
        try {
            const stored = localStorage.getItem(this.VIEWS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load views from localStorage:', error);
            return [];
        }
    }

    private setStoredViews(views: SavedView[]): boolean {
        try {
            localStorage.setItem(this.VIEWS_KEY, JSON.stringify(views));
            return true;
        } catch (error) {
            console.error('Failed to save views to localStorage:', error);
            return false;
        }
    }

    async listViews(): Promise<ViewStoreResult<SavedView[]>> {
        await this.delay();
        try {
            const views = this.getStoredViews();
            return { success: true, data: views };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to list views'
            };
        }
    }

    async createView(viewData: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>): Promise<ViewStoreResult<SavedView>> {
        await this.delay();
        try {
            const views = this.getStoredViews();
            const now = new Date().toISOString();

            const newView: SavedView = {
                ...viewData,
                id: this.generateId(),
                createdAt: now,
                updatedAt: now,
            };

            views.push(newView);

            if (this.setStoredViews(views)) {
                return { success: true, data: newView };
            } else {
                return { success: false, error: 'Failed to save view' };
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create view'
            };
        }
    }

    async updateView(view: SavedView): Promise<ViewStoreResult<SavedView>> {
        await this.delay();
        try {
            const views = this.getStoredViews();
            const index = views.findIndex(v => v.id === view.id);

            if (index === -1) {
                return { success: false, error: 'View not found' };
            }

            const updatedView: SavedView = {
                ...view,
                updatedAt: new Date().toISOString(),
            };

            views[index] = updatedView;

            if (this.setStoredViews(views)) {
                return { success: true, data: updatedView };
            } else {
                return { success: false, error: 'Failed to update view' };
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update view'
            };
        }
    }

    async deleteView(id: string): Promise<ViewStoreResult> {
        await this.delay();
        try {
            const views = this.getStoredViews();
            const filteredViews = views.filter(v => v.id !== id);

            if (filteredViews.length === views.length) {
                return { success: false, error: 'View not found' };
            }

            if (this.setStoredViews(filteredViews)) {
                // Clear default view if it was deleted
                const defaultResult = await this.getDefaultView();
                if (defaultResult.success && defaultResult.data?.id === id) {
                    localStorage.removeItem(this.DEFAULT_VIEW_KEY);
                }

                // Clear last used view if it was deleted
                const lastUsedResult = await this.getLastUsedView();
                if (lastUsedResult.success && lastUsedResult.data === id) {
                    localStorage.removeItem(this.LAST_USED_VIEW_KEY);
                }

                return { success: true };
            } else {
                return { success: false, error: 'Failed to delete view' };
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete view'
            };
        }
    }

    async getDefaultView(): Promise<ViewStoreResult<SavedView | null>> {
        await this.delay();
        try {
            const defaultViewId = localStorage.getItem(this.DEFAULT_VIEW_KEY);
            if (!defaultViewId) {
                return { success: true, data: null };
            }

            const views = this.getStoredViews();
            const defaultView = views.find(v => v.id === defaultViewId);

            if (!defaultView) {
                // Clean up stale reference
                localStorage.removeItem(this.DEFAULT_VIEW_KEY);
                return { success: true, data: null };
            }

            return { success: true, data: defaultView };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get default view'
            };
        }
    }

    async setDefaultView(id: string): Promise<ViewStoreResult> {
        await this.delay();
        try {
            const views = this.getStoredViews();
            const view = views.find(v => v.id === id);

            if (!view) {
                return { success: false, error: 'View not found' };
            }

            localStorage.setItem(this.DEFAULT_VIEW_KEY, id);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to set default view'
            };
        }
    }

    async getLastUsedView(): Promise<ViewStoreResult<string | null>> {
        await this.delay();
        try {
            const lastUsedViewId = localStorage.getItem(this.LAST_USED_VIEW_KEY);
            return { success: true, data: lastUsedViewId };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get last used view'
            };
        }
    }

    async setLastUsedView(id: string): Promise<ViewStoreResult> {
        await this.delay();
        try {
            localStorage.setItem(this.LAST_USED_VIEW_KEY, id);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to set last used view'
            };
        }
    }
}

// Export singleton instance
export const viewStore: IViewStore = new LocalStorageViewStore();

// Utility functions
export function createDefaultView(): Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'> {
    return {
        name: 'Default View',
        query: '',
        filters: DEFAULT_FILTERS,
        columns: DEFAULT_COLUMNS,
        groupBy: null,
        sortBy: null,
        isDefault: true,
    };
}

export function isViewModified(
    currentState: {
        query: string;
        filters: FiltersState;
        columns: ColumnConfig[];
        groupBy: GroupKey;
        sortBy: SortSpec[] | null;
    },
    savedView: SavedView
): boolean {
    return (
        currentState.query !== savedView.query ||
        JSON.stringify(currentState.filters) !== JSON.stringify(savedView.filters) ||
        JSON.stringify(currentState.columns) !== JSON.stringify(savedView.columns) ||
        currentState.groupBy !== savedView.groupBy ||
        JSON.stringify(currentState.sortBy) !== JSON.stringify(savedView.sortBy)
    );
}
