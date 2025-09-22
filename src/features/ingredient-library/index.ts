// Main export for the Ingredient Library feature
export { IngredientLibrary } from './view/IngredientLibrary';

// Data source exports
export { LocalDataSource } from './services/localDataSource';
export { DxApiClient } from './services/dxApiClient';
export type { IDataSource } from './services/dataSource';

// Type exports
export type {
    Ingredient,
    IngredientId,
    IngredientStatus,
    IngredientType,
    IngredientFilters,
    TableState,
    StatsData,
    ExportOptions
} from './model/types';

// Component exports
export { CompareDialog } from './view/components/CompareDialog';

// Utility exports
export {
    exportToCSV,
    exportToJSON,
    calculateStats,
    formatCurrency,
    formatDate,
    formatPercentage,
    formatStock
} from './controller/selectors';

// Style exports
export {
    tableStyles,
    toolbarStyles,
    badgeStyles,
    statsStyles,
    modalStyles
} from './styles';

// Theme exports
export { tokens } from './theme/tokens';
export { Icon } from './theme/icons';
export type { IconName } from './theme/iconTypes';
export { icons } from './theme/iconConstants';

// Data exports
export { INGREDIENTS_SEED, CATEGORIES, FAMILIES, SUPPLIERS } from './data/ingredients.sample';
