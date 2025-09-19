import React, { useState, useEffect } from 'react';
import { ConfigManager, CONFIG_PRESETS } from '../../constants/configManager';
import type { MasterConfig } from '../../constants/configManager';
import type { UIConfig } from '../../constants/uiConfig';
import type { FilterConfig } from '../../constants/filterConfig';

interface ConfigPageProps {
  initialConfig?: MasterConfig;
  onConfigChange?: (config: MasterConfig) => void;
  onSave?: (config: MasterConfig) => void;
  onCancel?: () => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({
  initialConfig,
  onConfigChange,
  onSave,
  onCancel,
}) => {
  const [configManager] = useState(() => new ConfigManager(initialConfig));
  const [config, setConfig] = useState<MasterConfig>(configManager.getConfig());
  const [activeTab, setActiveTab] = useState<'ui' | 'table' | 'filters' | 'data' | 'features' | 'performance'>('ui');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const validation = configManager.validateConfig();
    setValidationErrors(validation.errors);
  }, [config]);

  const handleConfigUpdate = (updates: Partial<MasterConfig>) => {
    configManager.updateConfig(updates);
    const newConfig = configManager.getConfig();
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handlePresetApply = (presetName: keyof typeof CONFIG_PRESETS) => {
    configManager.applyPreset(presetName);
    const newConfig = configManager.getConfig();
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleSave = () => {
    const validation = configManager.validateConfig();
    if (validation.isValid) {
      onSave?.(config);
    } else {
      setValidationErrors(validation.errors);
    }
  };

  const handleExport = () => {
    const configJson = configManager.exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = configManager.importConfig(e.target?.result as string);
        if (result.success) {
          const newConfig = configManager.getConfig();
          setConfig(newConfig);
          onConfigChange?.(newConfig);
        } else {
          alert(`Import failed: ${result.error}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'ui', label: 'UI Components', icon: '🎨' },
    { id: 'table', label: 'Table Settings', icon: '📊' },
    { id: 'filters', label: 'Filters', icon: '🔍' },
    { id: 'data', label: 'Data Source', icon: '💾' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'performance', label: 'Performance', icon: '🚀' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Table Configuration</h1>
          <p className="text-gray-600 mt-1">Configure all aspects of your ingredient table</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Export Config
          </button>
          <label className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            Import Config
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">Configuration Errors:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Presets */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(CONFIG_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePresetApply(key as keyof typeof CONFIG_PRESETS)}
              className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}</div>
              <div className="text-sm text-gray-600">Apply preset configuration</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* UI Configuration Tab */}
          {activeTab === 'ui' && (
            <UIConfigTab
              config={config.ui}
              onChange={(uiConfig) => handleConfigUpdate({ ui: uiConfig })}
            />
          )}

          {/* Table Configuration Tab */}
          {activeTab === 'table' && (
            <TableConfigTab
              config={config.table}
              onChange={(tableConfig) => handleConfigUpdate({ table: tableConfig })}
            />
          )}

          {/* Filters Configuration Tab */}
          {activeTab === 'filters' && (
            <FiltersConfigTab
              config={config.filters}
              onChange={(filters) => handleConfigUpdate({ filters })}
            />
          )}

          {/* Data Source Configuration Tab */}
          {activeTab === 'data' && (
            <DataSourceConfigTab
              config={config.dataSource}
              onChange={(dataSource) => handleConfigUpdate({ dataSource })}
            />
          )}

          {/* Features Configuration Tab */}
          {activeTab === 'features' && (
            <FeaturesConfigTab
              config={config.features}
              onChange={(features) => handleConfigUpdate({ features })}
            />
          )}

          {/* Performance Configuration Tab */}
          {activeTab === 'performance' && (
            <PerformanceConfigTab
              config={config.performance}
              onChange={(performance) => handleConfigUpdate({ performance })}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

// UI Configuration Tab Component
const UIConfigTab: React.FC<{
  config: UIConfig;
  onChange: (config: UIConfig) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (updates: Partial<UIConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">UI Component Visibility</h3>
      
      {/* Header Configuration */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Header</h4>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.header.showTitle}
              onChange={(e) => updateConfig({
                header: { ...config.header, showTitle: e.target.checked }
              })}
              className="mr-2"
            />
            Show Title
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.header.showDescription}
              onChange={(e) => updateConfig({
                header: { ...config.header, showDescription: e.target.checked }
              })}
              className="mr-2"
            />
            Show Description
          </label>
        </div>
      </div>

      {/* Stats Configuration */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Statistics Cards</h4>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.stats.enabled}
              onChange={(e) => updateConfig({
                stats: { ...config.stats, enabled: e.target.checked }
              })}
              className="mr-2"
            />
            Enable Stats Cards
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.stats.showTotal}
              onChange={(e) => updateConfig({
                stats: { ...config.stats, showTotal: e.target.checked }
              })}
              className="mr-2"
            />
            Show Total Count
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.stats.showActive}
              onChange={(e) => updateConfig({
                stats: { ...config.stats, showActive: e.target.checked }
              })}
              className="mr-2"
            />
            Show Active Count
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.stats.showFavorites}
              onChange={(e) => updateConfig({
                stats: { ...config.stats, showFavorites: e.target.checked }
              })}
              className="mr-2"
            />
            Show Favorites Count
          </label>
        </div>
      </div>

      {/* Toolbar Configuration */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Toolbar</h4>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.toolbar.enabled}
              onChange={(e) => updateConfig({
                toolbar: { ...config.toolbar, enabled: e.target.checked }
              })}
              className="mr-2"
            />
            Enable Toolbar
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.toolbar.showSearch}
              onChange={(e) => updateConfig({
                toolbar: { ...config.toolbar, showSearch: e.target.checked }
              })}
              className="mr-2"
            />
            Show Search
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.toolbar.showFilters}
              onChange={(e) => updateConfig({
                toolbar: { ...config.toolbar, showFilters: e.target.checked }
              })}
              className="mr-2"
            />
            Show Filters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.toolbar.showCompare}
              onChange={(e) => updateConfig({
                toolbar: { ...config.toolbar, showCompare: e.target.checked }
              })}
              className="mr-2"
            />
            Show Compare
          </label>
        </div>
      </div>

      {/* Pagination Configuration */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Pagination</h4>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.pagination.enabled}
              onChange={(e) => updateConfig({
                pagination: { ...config.pagination, enabled: e.target.checked }
              })}
              className="mr-2"
            />
            Enable Pagination
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.pagination.showPageSizeSelector}
              onChange={(e) => updateConfig({
                pagination: { ...config.pagination, showPageSizeSelector: e.target.checked }
              })}
              className="mr-2"
            />
            Show Page Size Selector
          </label>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const TableConfigTab: React.FC<{ config: any; onChange: (config: any) => void }> = () => (
  <div className="text-center py-8 text-gray-500">Table configuration coming soon...</div>
);

const FiltersConfigTab: React.FC<{ config: FilterConfig[]; onChange: (config: FilterConfig[]) => void }> = () => (
  <div className="text-center py-8 text-gray-500">Filters configuration coming soon...</div>
);

const DataSourceConfigTab: React.FC<{ config: any; onChange: (config: any) => void }> = () => (
  <div className="text-center py-8 text-gray-500">Data source configuration coming soon...</div>
);

const FeaturesConfigTab: React.FC<{ config: any; onChange: (config: any) => void }> = () => (
  <div className="text-center py-8 text-gray-500">Features configuration coming soon...</div>
);

const PerformanceConfigTab: React.FC<{ config: any; onChange: (config: any) => void }> = () => (
  <div className="text-center py-8 text-gray-500">Performance configuration coming soon...</div>
);
