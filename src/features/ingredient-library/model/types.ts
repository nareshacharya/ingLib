export type IngredientId = string;

export type Availability = "InStock" | "Limited" | "OutOfStock";

export type IngredientStatus = "Active" | "Inactive" | "Limited";

export type IngredientType = "Natural" | "Synthetic";

export type StockLevel = "High" | "Medium" | "Low" | "OutOfStock";

export interface Ingredient {
    id: IngredientId;
    name: string;
    category: string;
    family: string;
    status: IngredientStatus;
    type: IngredientType;
    supplier: string;
    costPerKg: number;
    stock: number;
    favorite: boolean;
    casNumber?: string;
    ifraLimitPct?: number;
    allergens?: string[];
    updatedAt: string;
    parentId?: IngredientId;
    subRows?: Ingredient[];
}

// Legacy interface - kept for backward compatibility
export interface IngredientFilters {
    search: string;
    categories: string[];
    statuses: IngredientStatus[];
    types: IngredientType[];
    suppliers: string[];
    stockLevels: StockLevel[];
    favoritesOnly: boolean;
}

// New flexible filters state
export interface FiltersState {
    search: string;
    categories: string[];
    statuses: IngredientStatus[];
    types: IngredientType[];
    suppliers: string[];
    stockLevels: StockLevel[];
    favoritesOnly: boolean;
    [filterId: string]: unknown;
}

export interface TableState {
    query: string;
    filters: FiltersState;
    groupBy: GroupKey;
    sortBy: SortSpec[];
    selection: Record<string, boolean>;
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    columnVisibility: Record<string, boolean>;
    columnConfig: ColumnConfig[];
    expanded: Record<string, boolean>;
    expandedGroups: Record<string, boolean>;
}

export type ColumnKey =
    | 'select'
    | 'name'
    | 'category'
    | 'family'
    | 'status'
    | 'type'
    | 'supplier'
    | 'costPerKg'
    | 'stock'
    | 'favorite'
    | 'casNumber'
    | 'ifraLimitPct'
    | 'allergens'
    | 'updatedAt'
    | 'actions';

export interface StatsData {
    total: number;
    active: number;
    lowStock: number;
    favorites: number;
}

export interface ExportOptions {
    format: 'csv' | 'json';
    includeColumns: ColumnKey[];
    filename?: string;
}

export interface CompareData {
    ingredients: Ingredient[];
    fields: Array<{
        key: keyof Ingredient;
        label: string;
        format?: (value: any) => string;
    }>;
}

export type GroupedIngredient = Ingredient & {
    groupKey?: string;
    groupLabel?: string;
    isGroupHeader?: boolean;
    level?: number;
};

// Saved Views
export interface SavedView {
    id: string;                    // uuid
    name: string;                  // user label
    query: string;
    filters: FiltersState;         // same shape as controller
    columns: ColumnConfig[];       // visibility + order + width
    groupBy?: GroupKey | null;
    sortBy?: SortSpec | null;
    isDefault?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SortSpec {
    id: string;
    desc: boolean;
}

// Configurable Columns
export type ColumnDefKey =
    | "select"
    | "favorite"
    | "name"
    | "category"
    | "family"
    | "status"
    | "type"
    | "supplier"
    | "costPerKg"
    | "stock"
    | "casNumber"
    | "ifraLimitPct"
    | "allergens"
    | "updatedAt"
    | "actions";

export interface ColumnConfig {
    key: ColumnDefKey;
    visible: boolean;
    width?: number;              // px
    order: number;
}

// Grouping
export type GroupKey = "family" | "supplier" | "category" | null;

// Configurable Filters
export type FilterKind = "select" | "multiselect" | "range" | "switch" | "text";

export interface FilterDef<T = any> {
    id: string;                  // e.g., "category"
    labelKey: string;            // i18n key or display label
    kind: FilterKind;
    options?: { value: T; labelKey: string }[]; // for select/multiselect
    getPredicate?: (activeValue: unknown) => (row: Ingredient) => boolean;
    dependsOn?: string[];        // optional dependency keys
    placeholder?: string;
    min?: number;
    max?: number;
}

// Update existing interfaces to use new types
