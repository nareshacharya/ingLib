import type { Ingredient, IngredientId, IngredientFilters, ExportOptions, StockLevel } from '../model/types';
import type { IDataSource, DataSourceResult, ListOptions } from './dataSource';
import { INGREDIENTS_SEED, CATEGORIES, FAMILIES, SUPPLIERS } from '../data/ingredients.sample';

export class LocalDataSource implements IDataSource {
    private ingredients: Ingredient[] = [...INGREDIENTS_SEED];

    private getStockLevel(stock: number): StockLevel {
        if (stock === 0) return 'OutOfStock';
        if (stock < 50) return 'Low';
        if (stock < 150) return 'Medium';
        return 'High';
    }

    private applyFilters(ingredients: Ingredient[], filters: Partial<IngredientFilters>): Ingredient[] {
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
                const stockLevel = this.getStockLevel(ingredient.stock);
                return filters.stockLevels!.includes(stockLevel);
            });
        }

        // Favorites filter
        if (filters.favoritesOnly) {
            filtered = filtered.filter(ingredient => ingredient.favorite);
        }

        return filtered;
    }

    private applySorting(ingredients: Ingredient[], sortBy: Array<{ id: string; desc: boolean }>): Ingredient[] {
        if (!sortBy.length) return ingredients;

        return [...ingredients].sort((a, b) => {
            for (const sort of sortBy) {
                let aValue = (a as Record<string, unknown>)[sort.id];
                let bValue = (b as Record<string, unknown>)[sort.id];

                // Handle special cases
                if (sort.id === 'costPerKg' || sort.id === 'stock') {
                    aValue = Number(aValue) || 0;
                    bValue = Number(bValue) || 0;
                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                let comparison = 0;
                if (aValue < bValue) comparison = -1;
                else if (aValue > bValue) comparison = 1;

                if (comparison !== 0) {
                    return sort.desc ? -comparison : comparison;
                }
            }
            return 0;
        });
    }

    private applyPagination(ingredients: Ingredient[], pagination?: { pageIndex: number; pageSize: number }): Ingredient[] {
        if (!pagination) return ingredients;

        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return ingredients.slice(start, end);
    }

    async list(options: ListOptions = {}): Promise<DataSourceResult<Ingredient[]>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay

            let result = [...this.ingredients];

            // Apply filters
            if (options.filters) {
                result = this.applyFilters(result, options.filters);
            }

            const total = result.length;

            // Apply sorting
            if (options.sortBy && options.sortBy.length > 0) {
                result = this.applySorting(result, options.sortBy);
            }

            // Apply pagination
            if (options.pagination) {
                result = this.applyPagination(result, options.pagination);
            }

            return {
                success: true,
                data: result,
                total,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async get(id: IngredientId): Promise<DataSourceResult<Ingredient>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay

            const ingredient = this.ingredients.find(ing => ing.id === id);
            if (!ingredient) {
                return {
                    success: false,
                    error: `Ingredient with ID ${id} not found`,
                };
            }

            return {
                success: true,
                data: ingredient,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async create(ingredient: Omit<Ingredient, 'id' | 'updatedAt'>): Promise<DataSourceResult<Ingredient>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay

            const newIngredient: Ingredient = {
                ...ingredient,
                id: `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                updatedAt: new Date().toISOString(),
            };

            this.ingredients.push(newIngredient);

            return {
                success: true,
                data: newIngredient,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async update(id: IngredientId, updates: Partial<Ingredient>): Promise<DataSourceResult<Ingredient>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 150)); // Simulate API delay

            const index = this.ingredients.findIndex(ing => ing.id === id);
            if (index === -1) {
                return {
                    success: false,
                    error: `Ingredient with ID ${id} not found`,
                };
            }

            const updatedIngredient: Ingredient = {
                ...this.ingredients[index],
                ...updates,
                id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString(),
            };

            this.ingredients[index] = updatedIngredient;

            return {
                success: true,
                data: updatedIngredient,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async delete(id: IngredientId): Promise<DataSourceResult<void>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay

            const index = this.ingredients.findIndex(ing => ing.id === id);
            if (index === -1) {
                return {
                    success: false,
                    error: `Ingredient with ID ${id} not found`,
                };
            }

            this.ingredients.splice(index, 1);

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async bulkExport(ids: IngredientId[], options: ExportOptions): Promise<DataSourceResult<string>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

            const ingredients = this.ingredients.filter(ing => ids.includes(ing.id));

            if (options.format === 'csv') {
                const headers = options.includeColumns.filter(col => col !== 'select' && col !== 'actions');
                const csvHeaders = headers.join(',');
                const csvRows = ingredients.map(ing =>
                    headers.map(header => {
                        const value = (ing as Record<string, unknown>)[header];
                        if (Array.isArray(value)) return `"${value.join('; ')}"`;
                        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
                        return value;
                    }).join(',')
                );

                const csvContent = [csvHeaders, ...csvRows].join('\n');
                return {
                    success: true,
                    data: csvContent,
                };
            } else {
                const jsonContent = JSON.stringify(ingredients, null, 2);
                return {
                    success: true,
                    data: jsonContent,
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async toggleFavorite(id: IngredientId): Promise<DataSourceResult<Ingredient>> {
        try {
            const ingredient = this.ingredients.find(ing => ing.id === id);
            if (!ingredient) {
                return {
                    success: false,
                    error: `Ingredient with ID ${id} not found`,
                };
            }

            return this.update(id, { favorite: !ingredient.favorite });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async duplicate(id: IngredientId): Promise<DataSourceResult<Ingredient>> {
        try {
            const ingredient = this.ingredients.find(ing => ing.id === id);
            if (!ingredient) {
                return {
                    success: false,
                    error: `Ingredient with ID ${id} not found`,
                };
            }

            const { id, updatedAt, ...ingredientData } = ingredient;
            return this.create({
                ...ingredientData,
                name: `${ingredient.name} (Copy)`,
            });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async archive(id: IngredientId): Promise<DataSourceResult<Ingredient>> {
        try {
            return this.update(id, { status: 'Inactive' });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async getFilterOptions(): Promise<DataSourceResult<{
        categories: string[];
        families: string[];
        suppliers: string[];
        statuses: string[];
        types: string[];
    }>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay

            return {
                success: true,
                data: {
                    categories: CATEGORIES,
                    families: FAMILIES,
                    suppliers: SUPPLIERS,
                    statuses: ['Active', 'Inactive'],
                    types: ['Natural', 'Synthetic'],
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
