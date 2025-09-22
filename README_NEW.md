# Ingredient Library - Enterprise Palette Manager for Perfumers

A comprehensive, enterprise-grade ingredient management system built for Palette Managers who oversee ingredient libraries for perfumers creating perfume formulas. This React-based application utilizes TanStack Table for advanced data operations and provides sophisticated filtering, comparison, hierarchical data management, and **user configuration persistence**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![TanStack Table](https://img.shields.io/badge/TanStack%20Table-8.21.3-green.svg)

## 🎯 Project Overview

This application serves as a centralized management system for perfume ingredients, allowing Palette Managers to:

- **Manage Large Datasets**: Handle thousands of ingredients with ~200 attributes each
- **Hierarchical Organization**: Organize ingredients with sub-components (Pure, Solvent, etc.)
- **Advanced Filtering**: Multi-dimensional filtering by category, status, supplier, stock levels
- **Data Comparison**: Side-by-side comparison of selected ingredients
- **Flexible Presentation**: Column management, sorting, grouping, and pagination
- **Data Integration**: Ready for external data sources (currently using sample data)
- **User Configuration Persistence**: Automatic saving and restoration of user preferences

## ✨ Key Features

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
- **User Configuration Persistence**: Automatic saving of user preferences across sessions

### 📊 Data Management

- **Ingredient Attributes**: 200+ attributes per ingredient (name, category, family, supplier, cost, stock, CAS number, IFRA limits, allergens, etc.)
- **Sub-Ingredient Support**: Pure, Solvent, and other variants as child rows
- **Stock Management**: Visual indicators for stock levels and low stock alerts
- **Favorites System**: Mark and filter preferred ingredients
- **Export Options**: CSV and JSON export with customizable columns
- **Clickable Ingredient IDs**: Configurable actions (URL redirect or modal popup)

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Loading States**: Skeleton loading and error handling
- **Real-time Stats**: Dynamic statistics with live updates
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Consistent Modal System**: Reusable modal components with consistent styling
- **User Configuration Management**: Intuitive UI for managing personal settings

### 🔧 Developer Experience

- **TypeScript-First**: 100% TypeScript with comprehensive type definitions
- **Modular Architecture**: Clean separation of concerns (Model, View, Controller)
- **Centralized Styling**: Consistent design system with Tailwind CSS
- **Configuration Management**: Environment-based feature toggles
- **Developer Tools**: Configuration UI available in development mode
- **Comprehensive Documentation**: Detailed setup and integration guides

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with ES2020+ support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ingLib

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### First Steps

1. **Explore the Interface**: Navigate through the ingredient library
2. **Try Filtering**: Use the advanced filters to narrow down results
3. **Customize View**: Adjust column visibility and sorting
4. **Compare Ingredients**: Select multiple ingredients for side-by-side comparison
5. **Manage Settings**: Click "My Settings" to configure your preferences

## 🏗️ Architecture

### Project Structure

```
src/features/ingredient-library/
├── constants/           # Configuration management
│   ├── configManager.ts # Master configuration system
│   ├── filterConfig.ts  # Filter definitions
│   ├── tableConfig.ts   # Table configuration
│   └── uiConfig.ts      # UI configuration
├── controller/          # Business logic
│   ├── advancedTableController.ts
│   └── selectors.ts     # Data selectors and formatters
├── data/               # Sample data
│   └── ingredients.sample.ts
├── hooks/              # React hooks
│   └── useUserConfig.ts # User configuration management
├── model/              # Type definitions
│   ├── types.ts        # Core interfaces
│   └── schemas.ts      # Data schemas
├── services/           # Data layer
│   ├── dataSource.ts   # Data source interface
│   ├── localDataSource.ts
│   ├── apiDataSource.ts
│   └── userConfigService.ts # User configuration persistence
├── styles.ts           # Centralized styling
├── theme/              # Design system
│   ├── icons.ts        # Icon components
│   ├── iconConstants.ts
│   ├── iconTypes.ts
│   └── tokens.ts
└── view/               # UI components
    ├── components/     # Reusable components
    │   ├── Modal.tsx   # Generic modal system
    │   ├── CompareDialog.tsx
    │   ├── IngredientDetailsModal.tsx
    │   ├── UserConfigManager.tsx
    │   └── ConfigPage.tsx
    └── IngredientLibrary.tsx # Main component
```

### Core Components

#### 1. **IngredientLibrary** (Main Component)
- Central orchestrator for all functionality
- Integrates user configuration persistence
- Manages table state and UI interactions

#### 2. **User Configuration System**
- **`useUserConfig` Hook**: React hook for configuration management
- **`UserConfigService`**: Storage abstraction layer
- **`UserConfigManager`**: UI component for settings management

#### 3. **Modal System**
- **`Modal`**: Generic, reusable modal component
- **`ConfirmModal`**: Pre-configured confirmation dialogs
- **`InfoModal`**: Information display modals

#### 4. **Data Layer**
- **`IDataSource`**: Abstract data source interface
- **`LocalDataSource`**: Browser-based data source
- **`ApiDataSource`**: API-based data source for server integration

## 🔧 Configuration

### Master Configuration

The application uses a centralized configuration system:

```typescript
interface MasterConfig {
  table: TableConfig;      // Table behavior and features
  ui: UIConfig;           // UI components and layout
  filter: FilterConfig;   // Filter definitions
  dataSource: DataSourceConfig; // Data source settings
}
```

### User Configuration Persistence

#### Automatic Persistence
- **Table State**: Column visibility, sorting, pagination, filters, grouping
- **UI State**: Panel visibility (filters, column manager)
- **Auto-save**: Changes automatically saved with 1-second debounce
- **Session Restoration**: Settings restored when user returns

#### Storage Options
- **LocalStorage**: Default browser-based storage
- **Pega Integration**: API-based storage for enterprise applications
- **Extensible**: Easy to add custom storage backends

#### Configuration Management UI
- **"My Settings" Button**: Accessible from header
- **Export/Import**: Download/upload configuration as JSON
- **Clear Settings**: Reset to defaults
- **Error Handling**: Visual feedback for issues

### Environment Configuration

#### Development Mode Features
- **Configuration UI**: Table configuration interface (hidden in production)
- **Debug Logging**: Enhanced console output
- **Hot Reloading**: Instant updates during development

#### Production Optimizations
- **Minified Build**: Optimized bundle size
- **Error Boundaries**: Graceful error handling
- **Performance Monitoring**: Built-in performance tracking

## 🎨 Styling System

### Design Tokens

Centralized styling through `styles.ts`:

```typescript
export const badgeStyles = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
  status: {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    Inactive: 'bg-gray-50 text-gray-700 border-gray-200/60'
  },
  // ... more styles
};
```

### Component Categories

- **Table Styles**: Row styling, hover effects, borders
- **Toolbar Styles**: Search, filters, actions
- **Badge Styles**: Status, type, stock level indicators
- **Modal Styles**: Consistent modal appearance
- **Layout Styles**: Spacing, containers, responsive design

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-Friendly**: Appropriate touch targets and spacing
- **Accessibility**: WCAG 2.1 AA compliant

## 📊 Data Management

### Ingredient Data Structure

```typescript
interface Ingredient {
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
  ingredientId?: {
    value: string;
    displayValue?: string;
    action: 'url' | 'popup';
    url?: string;
    popupTitle?: string;
  };
}
```

### Data Sources

#### LocalDataSource (Default)
- Sample data for development and demonstration
- Instant loading and filtering
- No network dependencies

#### ApiDataSource (Production Ready)
- RESTful API integration
- Async data loading with error handling
- Retry logic and caching
- Ready for Pega integration

### Data Operations

- **CRUD Operations**: Create, Read, Update, Delete ingredients
- **Bulk Operations**: Multi-select actions
- **Data Validation**: Type-safe data handling
- **Error Handling**: Graceful degradation

## 🔌 Integration Guide

### Pega Application Integration

#### 1. **Storage Configuration**
```typescript
import { useUserConfig } from './hooks/useUserConfig';

const config = useUserConfig({
  storageType: 'pega',
  apiBaseUrl: 'https://your-pega-instance.com/api',
});
```

#### 2. **Required API Endpoints**
- `GET /api/user-preferences/{userId}` - Load user preferences
- `PUT /api/user-preferences/{userId}` - Save user preferences
- `DELETE /api/user-preferences/{userId}` - Clear user preferences

#### 3. **Authentication Integration**
```typescript
function getCurrentUserId(): string {
  return pega.getCurrentUser().getID();
}
```

### Standalone Application

#### 1. **Default Configuration**
```typescript
import { useUserConfig } from './hooks/useUserConfig';

const config = useUserConfig(); // Uses LocalStorage by default
```

#### 2. **Custom User ID**
```typescript
function getCurrentUserId(): string {
  return yourAuthSystem.getCurrentUser().id;
}
```

### Custom Storage Implementation

```typescript
class CustomStorageService implements UserConfigStorage {
  async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    // Your custom storage implementation
  }
  
  async loadPreferences(userId: string): Promise<UserPreferences | null> {
    // Your custom loading implementation
  }
  
  // ... other methods
}
```

## 🛠️ Development

### Development Workflow

1. **Setup**: Clone repository and install dependencies
2. **Development**: Use `npm run dev` for hot reloading
3. **Testing**: Run `npm run test` for unit tests
4. **Build**: Use `npm run build` for production build
5. **Linting**: Use `npm run lint` for code quality checks

### Common Development Tasks

#### Adding New Filters
```typescript
// 1. Update filterConfig.ts
export const FILTER_CONFIG = [
  // ... existing filters
  {
    id: 'newFilter',
    label: 'New Filter',
    type: 'checkbox',
    enabled: true,
    icon: 'newFilterIcon',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
];

// 2. Update types.ts
export type FilterKey = 'category' | 'status' | 'type' | 'supplier' | 'newFilter';
```

#### Customizing UI Components
```typescript
// Update uiConfig.ts
export const DEFAULT_UI_CONFIG: UIConfig = {
  header: {
    showTitle: true,
    title: 'Custom Ingredient Library',
    showDescription: true,
    description: 'Your custom description',
  },
  // ... other configurations
};
```

#### Adding New Data Sources
```typescript
class CustomDataSource implements IDataSource {
  async list(options?: ListOptions): Promise<DataSourceResult<Ingredient[]>> {
    // Your data fetching logic
  }
  
  // ... implement other required methods
}
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency rules
- **Prettier**: Code formatting (if configured)
- **Husky**: Pre-commit hooks for quality gates

## 🐛 Troubleshooting

### Common Issues

#### Configuration Not Saving
- **Check**: Browser LocalStorage quota
- **Verify**: Auto-save is enabled
- **Debug**: Check console for JavaScript errors

#### Settings Not Restoring
- **Verify**: User ID is consistent across sessions
- **Check**: Configuration data integrity
- **Ensure**: Proper initialization order

#### Import/Export Failures
- **Validate**: JSON format is correct
- **Check**: File size limits
- **Verify**: Version compatibility

#### Table Rendering Issues
- **Check**: Data source connectivity
- **Verify**: Column definitions are correct
- **Debug**: Console for data loading errors

### Debug Information

```typescript
// Enable debug logging
const config = useUserConfig({
  storageType: 'localStorage',
  autoSave: true,
  saveDelay: 1000,
});

// Check current state
console.log('Current preferences:', config.preferences);
console.log('Loading state:', config.isLoading);
console.log('Error state:', config.error);
```

### Performance Issues

- **Large Datasets**: Consider pagination and virtualization
- **Complex Filters**: Optimize filter logic
- **Memory Usage**: Monitor component unmounting
- **Network Requests**: Implement proper caching

## 📈 Performance Considerations

### Optimization Strategies

- **Debounced Saves**: Prevents excessive storage operations
- **Selective Updates**: Only saves changed properties
- **Lazy Loading**: Configuration loaded only when needed
- **Memory Management**: Proper cleanup of timeouts and listeners

### Storage Limits

- **LocalStorage**: ~5-10MB limit (sufficient for configuration data)
- **API Storage**: No practical limits (depends on server configuration)
- **Compression**: Consider compression for large configurations

### Rendering Performance

- **Virtual Scrolling**: For large datasets
- **Memoization**: React.memo for expensive components
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Considerations

### Data Protection

- **User Isolation**: Each user's configuration stored separately
- **Validation**: Input validation for imported configurations
- **Sanitization**: Clean data before storage
- **Access Control**: Proper authentication for API-based storage

### Privacy

- **Local Storage**: Data stays in user's browser
- **API Storage**: Follows enterprise security policies
- **No Sensitive Data**: Only UI preferences stored, no business data

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Deploy to your hosting platform
npm run deploy
```

### Environment Variables

```bash
# Development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_DEV_TOOLS=true

# Production
VITE_API_BASE_URL=https://your-api.com/api
VITE_ENABLE_DEV_TOOLS=false
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📚 API Reference

### Core Hooks

#### `useUserConfig(options?)`
Manages user configuration persistence.

**Parameters:**
- `storageType`: 'localStorage' | 'pega' (default: 'localStorage')
- `apiBaseUrl`: string (required for 'pega' storage)
- `autoSave`: boolean (default: true)
- `saveDelay`: number (default: 1000ms)

**Returns:**
- `preferences`: Current user preferences
- `isLoading`: Loading state
- `error`: Error state
- `updateTableState()`: Update table configuration
- `updateUIState()`: Update UI configuration
- `exportPreferences()`: Export configuration
- `importPreferences()`: Import configuration

### Component Props

#### `IngredientLibrary`
Main component with no required props.

#### `Modal`
Generic modal component with configurable size, content, and actions.

#### `UserConfigManager`
Configuration management UI component.

### Data Interfaces

#### `UserPreferences`
Complete user configuration including table state, UI state, and metadata.

#### `Ingredient`
Core ingredient data structure with all attributes and relationships.

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- **TypeScript**: All code must be properly typed
- **ESLint**: Follow established linting rules
- **Documentation**: Update documentation for new features
- **Testing**: Add tests for new functionality

### Pull Request Process

1. **Description**: Clear description of changes
2. **Testing**: Manual testing steps
3. **Documentation**: Update relevant documentation
4. **Review**: Address reviewer feedback
5. **Merge**: Squash and merge when approved

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TanStack Table**: Advanced table functionality
- **React**: Component framework
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tooling

## 📞 Support

For questions, issues, or contributions:

- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check this README and inline code comments
- **Examples**: See `ModalExamples.tsx` for usage patterns

---

**Built with ❤️ for Palette Managers and Perfumers**
