import type {
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    VisibilityState,
    ExpandedState,
    PaginationState
} from "@tanstack/react-table";
import type { Ingredient } from "../model/types";

// Advanced Table State Interface
export interface AdvancedTableState {
    columnOrder: ColumnOrderState;
    columnPinning: ColumnPinningState;
    columnSizing: ColumnSizingState;
    columnVisibility: VisibilityState;
    expanded: ExpandedState;
    pagination: PaginationState;
}

// Default advanced table state
export const defaultAdvancedTableState: AdvancedTableState = {
    columnOrder: ['select', 'expander', 'id', 'name', 'category', 'family', 'status', 'type', 'supplier', 'costPerKg', 'stock', 'favorite'],
    columnPinning: {
        left: ['select', 'expander'],
        right: []
    },
    columnSizing: {},
    columnVisibility: {
        select: true,
        expander: true,
        name: true,
        category: true,
        family: true,
        status: true,
        type: true,
        supplier: true,
        costPerKg: true,
        stock: true,
        favorite: true,
        casNumber: false,
        ifraLimitPct: false,
        allergens: false,
        updatedAt: false
    },
    expanded: {},
    pagination: {
        pageIndex: 0,
        pageSize: 25
    }
};

// Helper functions for managing table state
export class AdvancedTableController {

    // Column ordering utilities
    static moveColumn(columnOrder: ColumnOrderState, fromIndex: number, toIndex: number): ColumnOrderState {
        const newOrder = [...columnOrder];
        const [movedColumn] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedColumn);
        return newOrder;
    }

    // Column pinning utilities
    static pinColumnLeft(columnPinning: ColumnPinningState, columnId: string): ColumnPinningState {
        return {
            ...columnPinning,
            left: [...(columnPinning.left || []), columnId],
            right: (columnPinning.right || []).filter(id => id !== columnId)
        };
    }

    static pinColumnRight(columnPinning: ColumnPinningState, columnId: string): ColumnPinningState {
        return {
            ...columnPinning,
            right: [...(columnPinning.right || []), columnId],
            left: (columnPinning.left || []).filter(id => id !== columnId)
        };
    }

    static unpinColumn(columnPinning: ColumnPinningState, columnId: string): ColumnPinningState {
        return {
            ...columnPinning,
            left: (columnPinning.left || []).filter(id => id !== columnId),
            right: (columnPinning.right || []).filter(id => id !== columnId)
        };
    }

    // Column sizing utilities
    static setColumnSize(columnSizing: ColumnSizingState, columnId: string, size: number): ColumnSizingState {
        return {
            ...columnSizing,
            [columnId]: size
        };
    }

    // Column visibility utilities
    static toggleColumnVisibility(columnVisibility: VisibilityState, columnId: string): VisibilityState {
        return {
            ...columnVisibility,
            [columnId]: !columnVisibility[columnId]
        };
    }

    static setColumnVisibility(columnVisibility: VisibilityState, columnId: string, visible: boolean): VisibilityState {
        return {
            ...columnVisibility,
            [columnId]: visible
        };
    }

    // Sub-rows/expanding utilities
    static isParentRow(ingredient: Ingredient): boolean {
        return !ingredient.parentId;
    }

    static isChildRow(ingredient: Ingredient): boolean {
        return !!ingredient.parentId;
    }

    static getChildRows(data: Ingredient[], parentId: string): Ingredient[] {
        return data.filter(ingredient => ingredient.parentId === parentId);
    }

    static buildHierarchicalData(data: Ingredient[]): Ingredient[] {
        const parentMap = new Map<string, Ingredient>();

        // First pass: Create a map of all items
        data.forEach(item => {
            parentMap.set(item.id, { ...item, subRows: [] });
        });

        const result: Ingredient[] = [];

        // Second pass: Build the hierarchy
        data.forEach(item => {
            const currentItem = parentMap.get(item.id)!;

            if (item.parentId) {
                // This is a child item
                const parent = parentMap.get(item.parentId);
                if (parent) {
                    if (!parent.subRows) {
                        parent.subRows = [];
                    }
                    parent.subRows.push(currentItem);
                }
            } else {
                // This is a parent item
                result.push(currentItem);
            }
        });

        return result;
    }

    // Pagination utilities
    static getPageCount(totalRows: number, pageSize: number): number {
        return Math.ceil(totalRows / pageSize);
    }

    static getPageData<T>(data: T[], pageIndex: number, pageSize: number): T[] {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return data.slice(start, end);
    }

    // Save/restore table state to localStorage
    static saveTableState(key: string, state: Partial<AdvancedTableState>): void {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save table state:', error);
        }
    }

    static loadTableState(key: string): Partial<AdvancedTableState> | null {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Failed to load table state:', error);
            return null;
        }
    }

    // Merge saved state with defaults
    static mergeTableState(
        defaults: AdvancedTableState,
        saved: Partial<AdvancedTableState> | null
    ): AdvancedTableState {
        if (!saved) return defaults;

        return {
            columnOrder: saved.columnOrder || defaults.columnOrder,
            columnPinning: { ...defaults.columnPinning, ...saved.columnPinning },
            columnSizing: { ...defaults.columnSizing, ...saved.columnSizing },
            columnVisibility: { ...defaults.columnVisibility, ...saved.columnVisibility },
            expanded: saved.expanded || defaults.expanded,
            pagination: { ...defaults.pagination, ...saved.pagination }
        };
    }
}
