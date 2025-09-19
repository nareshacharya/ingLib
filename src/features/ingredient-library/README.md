# Ingredient Library

A comprehensive, enterprise-grade ingredient management system built with React, TypeScript, and TanStack Table.

![Ingredient Library Screenshot](./screenshot.png)

## Features

### ✨ Core Functionality

- **Advanced Table Management**: Sorting, filtering, grouping, hierarchical rows, column visibility
- **Real-time Search**: Debounced search across multiple fields
- **Multi-level Filtering**: By category, status, type, supplier, stock level, and favorites
- **Bulk Operations**: Compare, edit, duplicate, export selected ingredients
- **Hierarchical Data**: Parent-child relationships with expandable rows
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

### 🎯 Data Features

- **Virtualization**: Handles large datasets efficiently with TanStack Virtual
- **Export Options**: CSV and JSON export with customizable columns
- **Real-time Stats**: Dynamic statistics with live updates
- **Favorites System**: Mark and filter favorite ingredients
- **Stock Monitoring**: Low stock alerts and color-coded indicators

### ♿ Accessibility

- **ARIA Compliance**: Full screen reader support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Focus Management**: Proper focus rings and tab order
- **Semantic HTML**: Proper heading hierarchy and landmarks

### 🎨 Design System

- **Unified Theming**: Centralized design tokens
- **Tailwind Integration**: Utility-first CSS with typed style maps
- **Mobile Responsive**: Adaptive layouts for all screen sizes
- **Loading States**: Skeleton loading and error boundaries

## Architecture

The ingredient library follows a strict **MVC (Model-View-Controller)** architecture:

```
src/features/ingredient-library/
├── README.md
├── index.ts
├── theme/
│   ├── tokens.ts          # Design tokens (colors, spacing, typography)
│   └── icons.tsx          # Icon system with typed SVG components
├── model/
│   ├── types.ts           # Core data types and interfaces
│   └── schemas.ts         # Type guards and validation
├── data/
│   ├── ingredients.sample.ts  # Mock data for development
│   └── i18n.en.ts         # Internationalization strings
├── services/
│   ├── dataSource.ts      # Data source interface
│   ├── dxApiClient.ts     # Pega DX API client (stub)
│   └── localDataSource.ts # Local data implementation
├── controller/
│   ├── tableController.tsx # TanStack Table management
│   └── selectors.ts       # Pure functions and utilities
├── view/
│   ├── IngredientLibrary.tsx # Main page component
│   └── components/        # Reusable UI components
└── styles.ts             # Typed Tailwind utility maps
```

### Design Principles

1. **Separation of Concerns**: Clear boundaries between data, logic, and presentation
2. **Type Safety**: Strict TypeScript with full type coverage
3. **Reusability**: Portable components with consistent APIs
4. **Performance**: Optimized for large datasets with virtualization
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Maintainability**: Self-documenting code with comprehensive types

## Data Integration

### Switching from Local to Pega DX API

The system is designed for easy integration with Pega DX API v2:

```typescript
// Development (using mock data)
import { LocalDataSource } from "./services/localDataSource";
const dataSource = new LocalDataSource();

// Production (using Pega DX API)
import { DxApiClient } from "./services/dxApiClient";
const dataSource = new DxApiClient("https://api.pega.com/v2", "your-api-key");
```

### Expected API Endpoints

```typescript
// GET /api/v2/ingredients - List with query params
// GET /api/v2/ingredients/{id} - Get single ingredient
// POST /api/v2/ingredients - Create ingredient
// PUT /api/v2/ingredients/{id} - Update ingredient
// DELETE /api/v2/ingredients/{id} - Delete ingredient
// POST /api/v2/ingredients/bulk-export - Bulk export
// PUT /api/v2/ingredients/{id}/favorite - Toggle favorite
// POST /api/v2/ingredients/{id}/duplicate - Duplicate ingredient
// PUT /api/v2/ingredients/{id}/archive - Archive ingredient
// GET /api/v2/ingredients/filter-options - Get filter options
```

## Theming

### Customizing Design Tokens

Override tokens in `theme/tokens.ts`:

```typescript
export const customTokens = {
  ...tokens,
  colors: {
    ...tokens.colors,
    primary: {
      ...tokens.colors.primary,
      500: "#your-brand-color",
    },
  },
};
```

### Style Customization

Styles are centralized in `styles.ts` with typed Tailwind utilities:

```typescript
export const customTableStyles = {
  ...tableStyles,
  row: "hover:bg-your-color data-[selected=true]:bg-your-selected-color",
};
```

## Usage Examples

### Basic Implementation

```tsx
import { IngredientLibrary } from "@/features/ingredient-library";

function App() {
  return (
    <div className="app">
      <IngredientLibrary />
    </div>
  );
}
```

### Custom Data Source

```tsx
import {
  useIngredientTableController,
  IDataSource,
} from "@/features/ingredient-library";

function CustomIngredientTable() {
  const customDataSource: IDataSource = new MyCustomDataSource();

  const controller = useIngredientTableController({
    dataSource: customDataSource,
    initialPageSize: 50,
  });

  return <div>{/* Custom implementation using controller */}</div>;
}
```

### Standalone Components

```tsx
import {
  StatsBar,
  DataTable,
  StatusBadge,
  formatCurrency,
} from "@/features/ingredient-library";

function MyDashboard() {
  return (
    <div>
      <StatsBar stats={myStats} />
      <StatusBadge status="Active" />
      <p>Price: {formatCurrency(125.5)}</p>
    </div>
  );
}
```

## Accessibility Checklist

- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ✅ Screen reader support (ARIA labels, roles, descriptions)
- ✅ Focus management (visible focus rings, logical tab order)
- ✅ Color contrast (WCAG AA compliant)
- ✅ Semantic HTML (proper headings, landmarks, tables)
- ✅ Alternative text for icons and images
- ✅ Error handling and user feedback
- ✅ Responsive design (mobile accessibility)

## Development

### Installation

```bash
# Install dependencies
npm install @tanstack/react-table @tanstack/react-virtual @radix-ui/react-dropdown-menu @radix-ui/react-dialog
```

### Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

### Testing

Run unit tests for controllers and selectors:

```bash
npm run test -- src/features/ingredient-library/controller/
```

Tests cover:

- Filter logic and edge cases
- Grouping and hierarchy building
- Selection state management
- Export functionality
- Data validation

## Performance Considerations

- **Virtualization**: Handles 10,000+ rows efficiently
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Memoized Calculations**: Stats and derived state cached
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Feature can be loaded asynchronously

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the established MVC architecture
2. Maintain strict TypeScript types
3. Include accessibility considerations
4. Add unit tests for new functionality
5. Update documentation for API changes

## License

MIT License - see LICENSE file for details.
