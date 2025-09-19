# Filter Configuration Guide

This document explains how to configure the filters for the Ingredient Library component.

## Overview

The filter system is now fully configurable through the `filterConfig.ts` file. You can easily control which filters are shown, how they behave, and what options they contain.

## Configuration File Location

```
src/features/ingredient-library/constants/filterConfig.ts
```

## Filter Configuration Structure

Each filter configuration has the following properties:

```typescript
interface FilterConfig {
  id: string; // Column ID that this filter targets
  label: string; // Display name for the filter
  icon: React.ReactElement; // Icon component to display
  type: "checkbox" | "multiselect"; // How the filter should be rendered
  options: { value: string; label: string }[]; // Available options for the filter
  enabled: boolean; // Whether this filter should be shown
}
```

## How to Configure Filters

### 1. Enable/Disable Filters

To hide a filter, set `enabled: false`:

```typescript
{
  id: 'supplier',
  label: 'Supplier',
  // ... other properties
  enabled: false  // This filter will be hidden
}
```

### 2. Change Filter Type

You can switch between two filter types:

- **`checkbox`**: Shows options as checkboxes (like Status and Type filters)
- **`multiselect`**: Shows options as a multi-select dropdown

```typescript
{
  id: 'category',
  label: 'Category',
  // ... other properties
  type: 'checkbox'  // or 'multiselect'
}
```

### 3. Add New Filters

To add a new filter, add a new configuration object to the `FILTER_CONFIG` array:

```typescript
{
  id: 'stock',  // Must match a column accessor key
  label: 'Stock Level',
  icon: React.createElement('svg', {
    // ... SVG properties
  }),
  type: 'checkbox',
  options: stockLevelOptions,  // Import from filterOptions.ts
  enabled: true
}
```

### 4. Modify Filter Options

Filter options are imported from `filterOptions.ts`. To change the available options, edit that file:

```typescript
// In filterOptions.ts
export const categoryOptions: FilterOption[] = [
  { value: "Essential Oils", label: "Essential Oils" },
  { value: "Fragrance", label: "Fragrance" },
  // Add or remove options here
];
```

## Current Filter Configuration

All filters are currently configured as checkbox type to provide a consistent user experience:

- **Category**: Checkbox style (changed from multiselect)
- **Status**: Checkbox style (unchanged)
- **Type**: Checkbox style (unchanged)
- **Supplier**: Checkbox style (changed from multiselect)

## Helper Functions

The configuration file also exports helper functions:

```typescript
// Get only enabled filters
const enabledFilters = getEnabledFilters();

// Get specific filter config
const categoryConfig = getFilterConfigById("category");

// Check if a filter is enabled
const isEnabled = isFilterEnabled("supplier");
```

## Best Practices

1. **Consistent Icons**: Use consistent icon styles across all filters
2. **Meaningful Labels**: Use clear, user-friendly labels
3. **Logical Grouping**: Order filters logically (most used first)
4. **Performance**: Consider the number of options - too many checkbox options might need multiselect instead
5. **Data Matching**: Ensure filter IDs match column accessor keys exactly

## Example: Adding a Price Range Filter

```typescript
// 1. Add to filterOptions.ts
export const priceRangeOptions: FilterOption[] = [
  { value: "budget", label: "Budget (<$50)" },
  { value: "mid", label: "Mid-range ($50-$200)" },
  { value: "premium", label: "Premium (>$200)" },
];

// 2. Add to filterConfig.ts
{
  id: 'priceRange',
  label: 'Price Range',
  icon: React.createElement('svg', {
    className: "w-4 h-4 text-gray-500",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, React.createElement('path', {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
  })),
  type: 'checkbox',
  options: priceRangeOptions,
  enabled: true
}

// 3. Make sure your table column has the matching accessor key 'priceRange'
```

This configuration system provides maximum flexibility while maintaining clean, maintainable code.
