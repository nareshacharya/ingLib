import React, { useState } from 'react';
import { Modal, ConfirmModal, InfoModal } from './Modal';
import { useUserConfig } from '../../hooks/useUserConfig';

interface UserConfigManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserConfigManager: React.FC<UserConfigManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    preferences,
    isLoading,
    error,
    savePreferences,
    clearPreferences,
    exportPreferences,
    importPreferences,
  } = useUserConfig();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      const configJson = await exportPreferences();
      
      // Create and download file
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ingredient-library-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowSuccessMessage('Configuration exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImport = async () => {
    try {
      setImportError(null);
      await importPreferences(importText);
      setImportText('');
      setShowImportModal(false);
      setShowSuccessMessage('Configuration imported successfully!');
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const handleClear = async () => {
    try {
      await clearPreferences();
      setShowClearConfirm(false);
      setShowSuccessMessage('Configuration cleared successfully!');
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  const formatLastUpdated = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const modalIcon = (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const footerActions = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Close
      </button>
      <button
        onClick={handleExport}
        disabled={isLoading || !preferences}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Export Config
      </button>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="User Configuration Manager"
        subtitle="Manage your personal settings and preferences"
        size="lg"
        icon={modalIcon}
        showFooter={true}
        footerActions={footerActions}
      >
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Configuration Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <p className="text-sm text-green-700 mt-1">{showSuccessMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Info */}
          {preferences && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-600">User ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{preferences.version}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Version</dt>
                  <dd className="text-sm text-gray-900">{preferences.version}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{formatLastUpdated(preferences.lastUpdated)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Visible Columns</dt>
                  <dd className="text-sm text-gray-900">
                    {Object.values(preferences.columnVisibility).filter(Boolean).length} of {Object.keys(preferences.columnVisibility).length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Active Filters</dt>
                  <dd className="text-sm text-gray-900">{preferences.columnFilters.length}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Sorting Rules</dt>
                  <dd className="text-sm text-gray-900">{preferences.sorting.length}</dd>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Configuration Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Import Configuration */}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Import Configuration</span>
              </button>

              {/* Clear Configuration */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center justify-center px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-medium text-red-700">Clear Configuration</span>
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">About User Configuration</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your settings are automatically saved as you use the application</li>
              <li>• Configuration includes column visibility, filters, sorting, and UI preferences</li>
              <li>• Export your configuration to share with others or backup your settings</li>
              <li>• Import configuration files to restore previous settings</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportText('');
          setImportError(null);
        }}
        title="Import Configuration"
        subtitle="Paste your configuration JSON below"
        size="lg"
        icon={
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        }
        showFooter={true}
        footerActions={
          <>
            <button
              onClick={() => {
                setShowImportModal(false);
                setImportText('');
                setImportError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Import
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {importError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{importError}</p>
            </div>
          )}
          
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste your configuration JSON here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <p className="text-sm text-gray-600">
            Paste the JSON configuration that was exported from this application or another instance.
          </p>
        </div>
      </Modal>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title="Clear Configuration"
        message="Are you sure you want to clear all your saved preferences? This action cannot be undone and will reset all your settings to default values."
        confirmText="Yes, Clear All"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Success Info Modal */}
      <InfoModal
        isOpen={!!showSuccessMessage}
        onClose={() => setShowSuccessMessage(null)}
        title="Success"
        message={showSuccessMessage || ''}
        buttonText="OK"
      />
    </>
  );
};
