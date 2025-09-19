export const i18n = {
    // Page Title
    pageTitle: 'Ingredient Library',

    // Stats Bar
    totalIngredients: 'Total',
    activeIngredients: 'Active',
    lowStockIngredients: 'Low Stock',
    favoriteIngredients: 'Favorites',

    // Toolbar
    searchPlaceholder: 'Search ingredients...',
    filterByCategory: 'Category',
    filterByStatus: 'Status',
    filterByType: 'Type',
    filterBySupplier: 'Supplier',
    filterByStockLevel: 'Stock Level',
    showFavoritesOnly: 'Favorites Only',
    clearAllFilters: 'Clear Filters',
    groupByFamily: 'Group by Family',
    groupBySupplier: 'Group by Supplier',
    noGrouping: 'No Grouping',
    exportSelected: 'Export Selected',
    compareSelected: 'Compare Selected',

    // Table Headers
    columnName: 'Name',
    columnCategory: 'Category',
    columnFamily: 'Family',
    columnStatus: 'Status',
    columnType: 'Type',
    columnSupplier: 'Supplier',
    columnCost: 'Cost/kg',
    columnStock: 'Stock',
    columnFavorite: 'Favorite',
    columnCasNumber: 'CAS Number',
    columnIfraLimit: 'IFRA Limit %',
    columnAllergens: 'Allergens',
    columnUpdated: 'Updated',
    columnActions: 'Actions',

    // Table Actions
    edit: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
    archive: 'Archive',
    activate: 'Activate',
    deactivate: 'Deactivate',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    exportRow: 'Export',

    // Bulk Actions
    bulkEdit: 'Edit Selected',
    bulkDuplicate: 'Duplicate Selected',
    bulkAddToFavorites: 'Add to Favorites',
    bulkExport: 'Export Selected',

    // Status Labels
    active: 'Active',
    inactive: 'Inactive',
    natural: 'Natural',
    synthetic: 'Synthetic',
    inStock: 'In Stock',
    limited: 'Limited',
    outOfStock: 'Out of Stock',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    // Compare Dialog
    compareDialogTitle: 'Compare Ingredients',
    compareDialogDescription: 'Compare the selected ingredients side by side',
    close: 'Close',
    cancel: 'Cancel',

    // Empty States
    noIngredientsFound: 'No ingredients found',
    noIngredientsDescription: 'Try adjusting your search or filter criteria',
    noSelectedIngredients: 'No ingredients selected',
    selectIngredientsToCompare: 'Select 2-5 ingredients to compare them',

    // Loading States
    loadingIngredients: 'Loading ingredients...',
    loadingStats: 'Loading statistics...',

    // Error States
    errorLoadingIngredients: 'Error loading ingredients',
    errorMessage: 'Something went wrong. Please try again.',

    // Confirmation Messages
    confirmDelete: 'Are you sure you want to delete this ingredient?',
    confirmBulkDelete: 'Are you sure you want to delete the selected ingredients?',
    confirmArchive: 'Are you sure you want to archive this ingredient?',

    // Success Messages
    ingredientDeleted: 'Ingredient deleted successfully',
    ingredientArchived: 'Ingredient archived successfully',
    ingredientUpdated: 'Ingredient updated successfully',
    ingredientDuplicated: 'Ingredient duplicated successfully',
    addedToFavorites: 'Added to favorites',
    removedFromFavorites: 'Removed from favorites',
    exportCompleted: 'Export completed successfully',

    // Accessibility
    sortColumn: 'Sort by {column}',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    toggleFavorite: 'Toggle favorite',
    openRowMenu: 'Open row menu',
    selectRow: 'Select row',
    selectAllRows: 'Select all rows',
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    showColumnOptions: 'Show column options',

    // Pagination
    rowsPerPage: 'Rows per page',
    page: 'Page',
    of: 'of',
    goToPage: 'Go to page',
    previousPage: 'Previous page',
    nextPage: 'Next page',

    // Formatting
    currency: '$',
    kilograms: 'kg',
    percentage: '%',

    // Filter Options
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',
    allTypes: 'All Types',
    allSuppliers: 'All Suppliers',
    allStockLevels: 'All Stock Levels',

    // Export Options
    exportToCSV: 'Export to CSV',
    exportToJSON: 'Export to JSON',
    exportFilename: 'ingredients-export'
} as const;

export type I18nKey = keyof typeof i18n;
