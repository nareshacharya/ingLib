# Table Configuration System

This directory contains the configuration system for the Ingredient Library table. All table features can be easily configured by modifying the configuration files.

## Files

- `tableConfig.ts` - Main configuration file with all available options
- `tableConfigExamples.ts` - Example configurations for common use cases
- `README.md` - This documentation file

## Quick Start

### To Enable Child Row Selection

1. Open `tableConfig.ts`
2. Find the `selection` configuration
3. Change `enableChildRowSelection: false` to `enableChildRowSelection: true`

```typescript
selection: {
  enableRowSelection: true,
  enableChildRowSelection: true, // Change this to true
  enableMultiRowSelection: true,
  maxSelections: 10,
},
```

### To Disable All Selection

1. Open `tableConfig.ts`
2. Find the `selection` configuration
3. Change `enableRowSelection: true` to `enableRowSelection: false`

```typescript
selection: {
  enableRowSelection: false, // Change this to false
  enableChildRowSelection: false,
  enableMultiRowSelection: false,
  maxSelections: 0,
},
```

### To Add New Filter Attributes

1. Open `tableConfig.ts`
2. Find the `filters.availableAttributes` array
3. Add your new filter:

```typescript
{
  key: 'newAttribute',
  label: 'New Filter',
  type: 'multiselect',
  options: ['Option 1', 'Option 2'],
  enabled: true,
},
```

## Configuration Options

### Selection Configuration

- `enableRowSelection` - Enable/disable row selection entirely
- `enableChildRowSelection` - Enable/disable selection of child rows
- `enableMultiRowSelection` - Enable/disable multiple row selection
- `maxSelections` - Maximum number of rows that can be selected

### Filter Configuration

- `enabled` - Enable/disable all filters
- `availableAttributes` - Array of available filter attributes
- `defaultFilters` - Which filters are shown by default

### Column Configuration

- `enableColumnVisibility` - Allow users to show/hide columns
- `enableColumnResizing` - Allow users to resize columns
- `enableColumnPinning` - Allow users to pin columns
- `enableColumnOrdering` - Allow users to reorder columns
- `defaultVisibleColumns` - Which columns are visible by default

### Sorting Configuration

- `enabled` - Enable/disable sorting
- `enableMultiColumnSorting` - Allow sorting by multiple columns
- `defaultSortColumn` - Default column to sort by
- `defaultSortDirection` - Default sort direction

### Pagination Configuration

- `enabled` - Enable/disable pagination
- `defaultPageSize` - Default number of items per page
- `pageSizeOptions` - Available page size options
- `enablePageSizeSelector` - Allow users to change page size

### Expansion Configuration

- `enabled` - Enable/disable row expansion
- `defaultExpandedRows` - Rows that are expanded by default
- `enableAutoExpand` - Automatically expand rows

### Grouping Configuration

- `enabled` - Enable/disable grouping
- `availableGroupByOptions` - Available grouping options
- `defaultGroupBy` - Default grouping option

### Export Configuration

- `enabled` - Enable/disable export functionality
- `availableFormats` - Available export formats
- `enableBulkExport` - Allow bulk export

### Comparison Configuration

- `enabled` - Enable/disable comparison functionality
- `maxComparableItems` - Maximum items that can be compared
- `enableSideBySideComparison` - Enable side-by-side comparison view

## Using Example Configurations

The `tableConfigExamples.ts` file contains pre-configured examples for common scenarios:

- `ENABLE_CHILD_SELECTION_CONFIG` - Enable child row selection
- `DISABLE_SELECTION_CONFIG` - Disable all selection
- `LIMITED_SELECTION_CONFIG` - Limit selection to 3 items
- `MINIMAL_FILTERS_CONFIG` - Show only basic filters
- `ADVANCED_FILTERS_CONFIG` - Show all available filters
- `READ_ONLY_CONFIG` - Read-only table with no interactions
- `LARGE_PAGE_CONFIG` - Larger page sizes
- `EXCEL_EXPORT_CONFIG` - Enable Excel export

To use an example configuration:

1. Copy the desired configuration from `tableConfigExamples.ts`
2. In `tableConfig.ts`, replace `DEFAULT_TABLE_CONFIG` with your chosen configuration
3. Or merge configurations: `{ ...DEFAULT_TABLE_CONFIG, ...ENABLE_CHILD_SELECTION_CONFIG }`

## Filter Attribute Types

- `text` - Text input for searching
- `select` - Single selection dropdown
- `multiselect` - Multiple selection dropdown
- `range` - Numeric range slider
- `date` - Date picker
- `boolean` - Checkbox for true/false values

## Adding Custom Filter Attributes

To add a new filter attribute:

1. Define the attribute in `tableConfig.ts`:

```typescript
{
  key: 'customField',
  label: 'Custom Field',
  type: 'multiselect',
  options: ['Value 1', 'Value 2', 'Value 3'],
  enabled: true,
},
```

2. Ensure your data model includes the field
3. The filter will automatically appear in the filter dropdown

## Best Practices

1. **Start Simple**: Begin with minimal configuration and add features as needed
2. **Test Changes**: Always test configuration changes in development
3. **Document Changes**: Keep track of configuration changes for team members
4. **Use Examples**: Reference `tableConfigExamples.ts` for common patterns
5. **Version Control**: Commit configuration changes with clear commit messages

## Troubleshooting

### Child Rows Not Selectable

- Check that `enableChildRowSelection` is set to `true`
- Verify that child rows have proper `parentId` values
- Ensure the data structure is hierarchical

### Filters Not Appearing

- Check that `filters.enabled` is `true`
- Verify that filter attributes have `enabled: true`
- Ensure the filter attribute `key` matches your data field names

### Performance Issues

- Reduce `defaultPageSize` for large datasets
- Disable unnecessary features like `enableColumnResizing`
- Use `enableMultiColumnSorting: false` for better performance

## Support

For questions or issues with the configuration system, refer to:
- The main Ingredient Library documentation
- The `tableConfigExamples.ts` file for examples
- The TypeScript interfaces for type safety
