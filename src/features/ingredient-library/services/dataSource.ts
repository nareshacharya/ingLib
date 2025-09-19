import type { Ingredient, IngredientId, IngredientFilters, ExportOptions } from '../model/types';

export interface DataSourceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    total?: number;
}

export interface ListOptions {
    filters?: Partial<IngredientFilters>;
    sortBy?: Array<{ id: string; desc: boolean }>;
    pagination?: {
        pageIndex: number;
        pageSize: number;
    };
}

export interface IDataSource {
    /**
     * List ingredients with optional filtering, sorting, and pagination
     */
    list(options?: ListOptions): Promise<DataSourceResult<Ingredient[]>>;

    /**
     * Get a single ingredient by ID
     */
    get(id: IngredientId): Promise<DataSourceResult<Ingredient>>;

    /**
     * Create a new ingredient
     */
    create(ingredient: Omit<Ingredient, 'id' | 'updatedAt'>): Promise<DataSourceResult<Ingredient>>;

    /**
     * Update an existing ingredient
     */
    update(id: IngredientId, updates: Partial<Ingredient>): Promise<DataSourceResult<Ingredient>>;

    /**
     * Delete an ingredient
     */
    delete(id: IngredientId): Promise<DataSourceResult<void>>;

    /**
     * Bulk export ingredients
     */
    bulkExport(ids: IngredientId[], options: ExportOptions): Promise<DataSourceResult<string>>;

    /**
     * Toggle favorite status
     */
    toggleFavorite(id: IngredientId): Promise<DataSourceResult<Ingredient>>;

    /**
     * Duplicate an ingredient
     */
    duplicate(id: IngredientId): Promise<DataSourceResult<Ingredient>>;

    /**
     * Archive an ingredient (soft delete)
     */
    archive(id: IngredientId): Promise<DataSourceResult<Ingredient>>;

    /**
     * Get available filter options
     */
    getFilterOptions(): Promise<DataSourceResult<{
        categories: string[];
        families: string[];
        suppliers: string[];
        statuses: string[];
        types: string[];
    }>>;
}
