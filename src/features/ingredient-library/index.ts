// Main export for the Ingredient Library feature
export { IngredientLibrary } from './view/IngredientLibrary';

// Controller exports
export { useIngredientTableController } from './controller/tableController';
export type { IngredientTableController } from './controller/tableController';

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
export { StatsBar } from './view/components/StatsBar';
export { Toolbar } from './view/components/Toolbar';
export { DataTable } from './view/components/DataTable';
export { CompareDialog } from './view/components/CompareDialog';
export { FilterDropdown } from './view/components/FilterDropdown';
export { StatusBadge, TypeBadge, StockBadge } from './view/components/Badges';
export { Empty } from './view/components/Empty';
export { Loading } from './view/components/Loading';
export { ErrorState } from './view/components/ErrorState';

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
export type { IconName } from './theme/icons';

// Data exports
export { INGREDIENTS_SEED, CATEGORIES, FAMILIES, SUPPLIERS } from './data/ingredients.sample';
export { i18n } from './data/i18n.en';
