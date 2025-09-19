import type { Ingredient, IngredientStatus, IngredientType, StockLevel } from './types';

export function isIngredient(obj: unknown): obj is Ingredient {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.category === 'string' &&
        typeof obj.family === 'string' &&
        ['Active', 'Inactive', 'Limited'].includes(obj.status) &&
        ['Natural', 'Synthetic'].includes(obj.type) &&
        typeof obj.supplier === 'string' &&
        typeof obj.costPerKg === 'number' &&
        typeof obj.stock === 'number' &&
        typeof obj.favorite === 'boolean' &&
        typeof obj.updatedAt === 'string'
    );
}

export function isIngredientStatus(value: string): value is IngredientStatus {
    return ['Active', 'Inactive', 'Limited'].includes(value);
}

export function isIngredientType(value: string): value is IngredientType {
    return ['Natural', 'Synthetic'].includes(value);
}

export function isStockLevel(value: string): value is StockLevel {
    return ['High', 'Medium', 'Low', 'OutOfStock'].includes(value);
}

export function validateIngredient(obj: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!obj) {
        errors.push('Ingredient object is required');
        return { isValid: false, errors };
    }

    if (!obj.id || typeof obj.id !== 'string') {
        errors.push('ID is required and must be a string');
    }

    if (!obj.name || typeof obj.name !== 'string') {
        errors.push('Name is required and must be a string');
    }

    if (!obj.category || typeof obj.category !== 'string') {
        errors.push('Category is required and must be a string');
    }

    if (!obj.family || typeof obj.family !== 'string') {
        errors.push('Family is required and must be a string');
    }

    if (!isIngredientStatus(obj.status)) {
        errors.push('Status must be "Active", "Inactive", or "Limited"');
    }

    if (!isIngredientType(obj.type)) {
        errors.push('Type must be either "Natural" or "Synthetic"');
    }

    if (!obj.supplier || typeof obj.supplier !== 'string') {
        errors.push('Supplier is required and must be a string');
    }

    if (typeof obj.costPerKg !== 'number' || obj.costPerKg < 0) {
        errors.push('Cost per kg must be a non-negative number');
    }

    if (typeof obj.stock !== 'number' || obj.stock < 0) {
        errors.push('Stock must be a non-negative number');
    }

    if (typeof obj.favorite !== 'boolean') {
        errors.push('Favorite must be a boolean');
    }

    if (!obj.updatedAt || typeof obj.updatedAt !== 'string') {
        errors.push('Updated at is required and must be a string');
    }

    if (obj.parentId && typeof obj.parentId !== 'string') {
        errors.push('Parent ID must be a string if provided');
    }

    if (obj.casNumber && typeof obj.casNumber !== 'string') {
        errors.push('CAS number must be a string if provided');
    }

    if (obj.ifraLimitPct && (typeof obj.ifraLimitPct !== 'number' || obj.ifraLimitPct < 0 || obj.ifraLimitPct > 100)) {
        errors.push('IFRA limit percentage must be a number between 0 and 100 if provided');
    }

    if (obj.allergens && (!Array.isArray(obj.allergens) || !obj.allergens.every((a: unknown) => typeof a === 'string'))) {
        errors.push('Allergens must be an array of strings if provided');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
