import type { Ingredient, IngredientStatus, IngredientType, StockLevel } from './types';

export function isIngredient(obj: unknown): obj is Ingredient {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    
    const objRecord = obj as Record<string, unknown>;
    return (
        typeof objRecord.id === 'string' &&
        typeof objRecord.name === 'string' &&
        typeof objRecord.category === 'string' &&
        typeof objRecord.family === 'string' &&
        ['Active', 'Inactive', 'Limited'].includes(objRecord.status as string) &&
        ['Natural', 'Synthetic'].includes(objRecord.type as string) &&
        typeof objRecord.supplier === 'string' &&
        typeof objRecord.costPerKg === 'number' &&
        typeof objRecord.stock === 'number' &&
        typeof objRecord.favorite === 'boolean' &&
        typeof objRecord.updatedAt === 'string'
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

    if (!obj || typeof obj !== 'object') {
        errors.push('Ingredient object is required');
        return { isValid: false, errors };
    }

    const objRecord = obj as Record<string, unknown>;

    if (!objRecord.id || typeof objRecord.id !== 'string') {
        errors.push('ID is required and must be a string');
    }

    if (!objRecord.name || typeof objRecord.name !== 'string') {
        errors.push('Name is required and must be a string');
    }

    if (!objRecord.category || typeof objRecord.category !== 'string') {
        errors.push('Category is required and must be a string');
    }

    if (!objRecord.family || typeof objRecord.family !== 'string') {
        errors.push('Family is required and must be a string');
    }

    if (!isIngredientStatus(objRecord.status as string)) {
        errors.push('Status must be "Active", "Inactive", or "Limited"');
    }

    if (!isIngredientType(objRecord.type as string)) {
        errors.push('Type must be either "Natural" or "Synthetic"');
    }

    if (!objRecord.supplier || typeof objRecord.supplier !== 'string') {
        errors.push('Supplier is required and must be a string');
    }

    if (typeof objRecord.costPerKg !== 'number' || objRecord.costPerKg < 0) {
        errors.push('Cost per kg must be a non-negative number');
    }

    if (typeof objRecord.stock !== 'number' || objRecord.stock < 0) {
        errors.push('Stock must be a non-negative number');
    }

    if (typeof objRecord.favorite !== 'boolean') {
        errors.push('Favorite must be a boolean');
    }

    if (!objRecord.updatedAt || typeof objRecord.updatedAt !== 'string') {
        errors.push('Updated at is required and must be a string');
    }

    if (objRecord.parentId && typeof objRecord.parentId !== 'string') {
        errors.push('Parent ID must be a string if provided');
    }

    if (objRecord.casNumber && typeof objRecord.casNumber !== 'string') {
        errors.push('CAS number must be a string if provided');
    }

    if (objRecord.ifraLimitPct && (typeof objRecord.ifraLimitPct !== 'number' || objRecord.ifraLimitPct < 0 || objRecord.ifraLimitPct > 100)) {
        errors.push('IFRA limit percentage must be a number between 0 and 100 if provided');
    }

    if (objRecord.allergens && (!Array.isArray(objRecord.allergens) || !objRecord.allergens.every((a: unknown) => typeof a === 'string'))) {
        errors.push('Allergens must be an array of strings if provided');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
