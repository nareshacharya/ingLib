# Ingredient Library - Palette Manager for Perfumers

A comprehensive, enterprise-grade ingredient management system built for Palette Managers who oversee ingredient libraries for perfumers creating perfume formulas. This React-based application utilizes TanStack Table for advanced data operations and provides sophisticated filtering, comparison, and hierarchical data management capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![TanStack Table](https://img.shields.io/badge/TanStack%20Table-8.21.3-green.svg)

## Project Overview

This application serves as a centralized management system for perfume ingredients, allowing Palette Managers to:

- **Manage Large Datasets**: Handle thousands of ingredients with ~200 attributes each
- **Hierarchical Organization**: Organize ingredients with sub-components (Pure, Solvent, etc.)
- **Advanced Filtering**: Multi-dimensional filtering by category, status, supplier, stock levels
- **Data Comparison**: Side-by-side comparison of selected ingredients
- **Flexible Presentation**: Column management, sorting, grouping, and pagination
- **Data Integration**: Ready for external data sources (currently using sample data)

## Key Features

### 🎯 Core Functionality

- **Advanced Table Operations**: Built on TanStack Table v8 with full feature support
- **Hierarchical Data Structure**: Parent-child relationships with expandable rows
- **Multi-Level Filtering**: Category, status, type, supplier, stock level, and favorites
- **Column Management**: Show/hide, reorder, resize, and pin columns
- **Data Comparison**: Compare 2-5 ingredients side-by-side
- **Search & Sort**: Global search with multi-column sorting
- **Pagination**: Configurable page sizes with navigation controls
- **Row Selection**: Multi-select with bulk operations
- **Data Grouping**: Group by any column with expand/collapse

### 📊 Data Management

- **Ingredient Attributes**: 200+ attributes per ingredient (name, category, family, supplier, cost, stock, CAS number, IFRA limits, allergens, etc.)
- **Sub-Ingredient Support**: Pure, Solvent, and other variants as child rows
- **Stock Management**: Visual indicators for stock levels and low stock alerts
- **Favorites System**: Mark and filter preferred ingredients
- **Export Options**: CSV and JSON export with customizable columns

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Loading States**: Skeleton loading and error handling
- **Real-time Stats**: Dynamic statistics with live updates
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Dark/Light Theme Ready**: Centralized design tokens for easy theming

## Project Structure

The application follows a strict **MVC (Model-View-Controller)** architecture for maintainability and scalability:

```
src/features/ingredient-library/
├── index.ts                     # Public API exports
├── styles.ts                    # Centralized Tailwind utility maps
├── constants/
│   ├── filterConfig.ts         # Filter configuration
│   ├── filterOptions.ts        # Filter option definitions
│   └── tableConfig.ts          # Table configuration options
├── theme/
│   ├── tokens.ts               # Design tokens (colors, spacing, typography)
│   ├── iconTypes.ts            # Icon type definitions
│   ├── iconConstants.ts        # Icon SVG definitions
│   └── icons.tsx               # Icon React components
├── model/
│   ├── types.ts                # Core data types and interfaces
│   └── schemas.ts              # Type guards and validation
├── data/
│   └── ingredients.sample.ts    # Mock data for development (832 ingredients)
├── services/
│   ├── dataSource.ts          # Data source interface
│   ├── dxApiClient.ts         # Pega DX API client (ready for integration)
│   └── localDataSource.ts     # Local data implementation
├── controller/
│   ├── advancedTableController.ts  # Advanced table state management
│   ├── selectors.ts                # Pure utility functions
│   └── __tests__/                  # Test suites
└── view/
    ├── IngredientLibrary.tsx       # Main page component
    └── components/                 # Reusable UI components
        └── CompareDialog.tsx       # Ingredient comparison dialog
```

## Data Architecture

### Ingredient Data Model

Each ingredient contains comprehensive information for perfume formulation:

```typescript
interface Ingredient {
  id: string; // Unique identifier
  name: string; // Ingredient name
  category: string; // Classification (Essential Oils, Isolates, etc.)
  family: string; // Chemical/botanical family
  status: "Active" | "Inactive" | "Limited";
  type: "Natural" | "Synthetic";
  supplier: string; // Supplier name
  costPerKg: number; // Cost per kilogram
  stock: number; // Current stock in kg
  favorite: boolean; // User preference flag
  casNumber?: string; // Chemical Abstracts Service number
  ifraLimitPct?: number; // IFRA usage limit percentage
  allergens?: string[]; // Known allergens
  updatedAt: string; // Last update timestamp
  parentId?: string; // For hierarchical relationships
  subRows?: Ingredient[]; // Child ingredients
}
```

### Hierarchical Structure

Ingredients can have sub-components for different purities or preparations:

- **Parent**: Main ingredient (e.g., "Bergamot Essential Oil")
- **Children**: Variants (e.g., "Bergamot FCF", "Bergamot Expressed")

### External Data Integration

The system is designed for seamless integration with external data sources:

```typescript
// Development (sample data)
const dataSource = new LocalDataSource();

// Production (Pega DX API or other external source)
const dataSource = new DxApiClient("https://api.your-system.com", apiKey);
```

## Configuration

### Table Configuration

All table features can be configured through `src/features/ingredient-library/constants/tableConfig.ts`:

```typescript
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  selection: {
    enableRowSelection: true,
    enableChildRowSelection: false,
    enableMultiRowSelection: true,
    maxSelections: 10,
  },
  expansion: {
    enabled: true,
    defaultExpandedRows: [],
    enableAutoExpand: false,
  },
  // ... other configurations
};
```

### Filter Configuration

Filters are configured through `src/features/ingredient-library/constants/filterConfig.ts`:

```typescript
export const FILTER_CONFIG: FilterConfig[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'checkbox',
    options: categoryOptions,
    enabled: true,
  },
  // ... other filters
];
```

### Quick Configuration Examples

**Enable Child Row Selection:**
```typescript
selection: {
  enableChildRowSelection: true, // Change to true
}
```

**Disable All Selection:**
```typescript
selection: {
  enableRowSelection: false, // Change to false
}
```

**Add New Filter:**
```typescript
{
  id: 'newField',
  label: 'New Filter',
  type: 'checkbox',
  options: newFieldOptions,
  enabled: true,
}
```

## Advanced Features

### 1. Multi-Dimensional Filtering

- **Text Search**: Global search across name, category, family, supplier, CAS number, allergens
- **Category Filters**: Essential Oils, Isolates, Aroma Chemicals, Natural Extracts
- **Status Filters**: Active, Inactive, Limited availability
- **Type Filters**: Natural vs Synthetic origin
- **Supplier Filters**: Multi-select from available suppliers
- **Stock Level Filters**: High, Medium, Low, Out of Stock
- **Favorites Filter**: Toggle to show only favorited ingredients

### 2. Column Management System

- **Visibility Control**: Show/hide any column
- **Drag & Drop Reordering**: Rearrange column order
- **Resizing**: Adjust column widths
- **Pinning**: Pin columns to left or right
- **Persistence**: Saves preferences to localStorage

### 3. Compare Ingredients Feature

- **Multi-Select**: Choose 2-5 ingredients for comparison
- **Side-by-Side View**: Tabular comparison of key attributes
- **Comprehensive Data**: Shows all relevant fields for decision making
- **Export Options**: Save comparison results

### 4. Data Grouping & Hierarchy

- **Group By Options**: Category, Family, Status, Type, Supplier
- **Expand/Collapse**: Interactive group headers
- **Hierarchical Rows**: Parent-child ingredient relationships
- **Visual Indicators**: Clear nesting and expansion states

### 5. Performance Optimizations

- **Virtualization**: Efficient handling of large datasets
- **Debounced Search**: 300ms delay prevents excessive filtering
- **Memoized Calculations**: Cached stats and derived data
- **Lazy Loading**: Components loaded on demand

## Technology Stack

### Core Dependencies

- **React 19.1.1**: Latest React with concurrent features
- **TypeScript 5.8.3**: Strict typing for reliability
- **TanStack Table 8.21.3**: Advanced table functionality
- **TanStack Virtual 3.13.12**: Virtualization for performance
- **Radix UI**: Accessible component primitives
- **Tailwind CSS 4.1.12**: Utility-first styling
- **Vite 7.1.2**: Fast development and building

### Development Tools

- **ESLint**: Code quality and consistency
- **Vitest**: Unit and integration testing
- **Testing Library**: Component testing utilities
- **TypeScript ESLint**: Type-aware linting rules

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ingLib1

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## Usage Examples

### Basic Implementation

```tsx
import { IngredientLibrary } from "@/features/ingredient-library";

function PaletteManagerApp() {
  return (
    <div className="app">
      <header>Palette Manager</header>
      <main>
        <IngredientLibrary />
      </main>
    </div>
  );
}
```

### Custom Data Source Integration

```tsx
import { IngredientLibrary } from "@/features/ingredient-library";
import { MyCustomDataSource } from "./services/myDataSource";

function CustomIngredientApp() {
  const dataSource = new MyCustomDataSource({
    apiUrl: "https://api.mycompany.com",
    apiKey: process.env.API_KEY,
  });

  return <IngredientLibrary dataSource={dataSource} />;
}
```

## API Integration

### Expected External API Endpoints

For production integration, implement these endpoints:

```typescript
// Ingredient CRUD
GET    /api/v2/ingredients           // List with query params
GET    /api/v2/ingredients/{id}      // Single ingredient
POST   /api/v2/ingredients           // Create ingredient
PUT    /api/v2/ingredients/{id}      // Update ingredient
DELETE /api/v2/ingredients/{id}      // Delete ingredient

// Bulk Operations
POST   /api/v2/ingredients/bulk-export     // Export selected
POST   /api/v2/ingredients/bulk-update     // Bulk updates

// User Preferences
PUT    /api/v2/ingredients/{id}/favorite   // Toggle favorite
GET    /api/v2/users/preferences           // User settings

// Metadata
GET    /api/v2/ingredients/filter-options  // Available filter values
GET    /api/v2/ingredients/stats           // Dashboard statistics
```

### Data Source Interface

Implement the `IDataSource` interface for custom backends:

```typescript
interface IDataSource {
  list(params?: QueryParams): Promise<DataResult<Ingredient[]>>;
  get(id: string): Promise<DataResult<Ingredient>>;
  create(ingredient: Partial<Ingredient>): Promise<DataResult<Ingredient>>;
  update(
    id: string,
    changes: Partial<Ingredient>
  ): Promise<DataResult<Ingredient>>;
  delete(id: string): Promise<DataResult<void>>;
  export(ids: string[], format: "csv" | "json"): Promise<DataResult<string>>;
}
```

## Known Issues & Solutions

### Current Status

✅ **All Major Issues Resolved**:
- **Expand/Collapse Functionality**: Fixed with proper chevron icons and working expansion
- **Compare Ingredients**: Fully functional with proper dialog display
- **Icon System**: Complete icon library with proper SVG rendering
- **Hierarchical Data**: Working parent-child relationships with expandable rows

### Recent Fixes

1. **Expander Column**: Now displays proper chevron icons (►/▼) with working expand/collapse functionality
2. **Icon Rendering**: Fixed SVG icon visibility with proper color inheritance
3. **Code Cleanup**: Removed 25+ unused files and components for cleaner codebase
4. **Circular Dependencies**: Resolved import issues with icon components

### Troubleshooting

#### If Expansion Still Not Working

- Check browser console for any JavaScript errors
- Verify that ingredients have `parentId` values in the data
- Ensure TanStack Table expansion is enabled in configuration

#### Performance Optimization

- Enable virtualization for tables > 1000 rows
- Use debounced search (300ms delay)
- Implement React.memo for expensive components

## Testing

### Test Coverage

- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Full feature workflows
- **Accessibility Tests**: Keyboard navigation and screen readers
- **Performance Tests**: Large dataset handling

### Running Tests

```bash
# All tests
npm run test

# Specific test suites
npm run test -- filterBuilder.test.ts
npm run test -- tableController.integration.test.ts

# Coverage report
npm run test:coverage
```

## Contributing

### Development Guidelines

1. **TypeScript First**: All code must be strictly typed
2. **MVC Architecture**: Maintain clear separation of concerns
3. **Accessibility**: Follow WCAG 2.1 AA guidelines
4. **Testing**: Include tests for new functionality
5. **Documentation**: Update README for API changes

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use centralized styles from styles.ts
- Implement proper error handling
- Include comprehensive JSDoc comments

## Performance Considerations

- **Dataset Size**: Optimized for 10,000+ ingredients
- **Memory Usage**: Efficient with virtualization
- **Loading Speed**: Sub-second initial load
- **Responsiveness**: 60fps interactions
- **Bundle Size**: Code splitting for optimal loading

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Roadmap

### ✅ Completed (Recent Updates)

- [x] **Expand/Collapse Functionality**: Fixed chevron icons and hierarchical row expansion
- [x] **Icon System**: Complete icon library with proper SVG rendering
- [x] **Code Cleanup**: Removed unused files and components
- [x] **Compare Dialog**: Fully functional ingredient comparison

### Near Term

- [ ] Enhanced mobile responsiveness
- [ ] Advanced filtering UI improvements
- [ ] Performance optimization for large datasets
- [ ] Enhanced export options

### Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Ingredient relationship mapping
- [ ] Batch operations interface
- [ ] Integration with formula management
- [ ] Multi-language support
- [ ] Advanced export formats (Excel, PDF)
- [ ] Real-time collaboration features

## License

MIT License - See LICENSE file for details.

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the comprehensive feature documentation in `src/features/ingredient-library/README.md`
3. Examine test files for usage examples
4. Check the implementation summary in `IMPLEMENTATION_SUMMARY.md`
