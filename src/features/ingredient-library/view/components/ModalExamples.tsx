import React, { useState } from 'react';
import { Modal, ConfirmModal, InfoModal } from './Modal';

/**
 * Example component demonstrating how to use the consistent modal system
 * This can be used as a reference for implementing modals throughout the application
 */
export const ModalExamples: React.FC = () => {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleConfirm = () => {
    // User confirmed action
    // Add your confirmation logic here
  };

  const handleDelete = () => {
    // User confirmed deletion
    // Add your deletion logic here
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Modal System Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Modal Example */}
        <button
          onClick={() => setShowBasicModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Basic Modal
        </button>

        {/* Confirm Modal Example */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Open Confirm Modal
        </button>

        {/* Info Modal Example */}
        <button
          onClick={() => setShowInfoModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Open Info Modal
        </button>

        {/* Custom Modal Example */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Open Custom Modal
        </button>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal Example"
        subtitle="This is a simple modal with custom content"
        size="md"
        icon={
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This is an example of a basic modal. You can put any content here.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Consistent styling across the application</li>
              <li>• Configurable size and content</li>
              <li>• Built-in close functionality</li>
              <li>• Accessible design</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Information"
        message="This is an informational modal. Use it to display important information to users."
        buttonText="Got it"
      />

      {/* Custom Modal with Footer */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Custom Modal with Footer"
        subtitle="This modal has custom footer actions"
        size="lg"
        icon={
          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        }
        showFooter={true}
        footerActions={
          <>
            <button
              onClick={() => setShowCustomModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Save action
                setShowCustomModal(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                // Delete action
                setShowCustomModal(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This modal demonstrates custom footer actions. You can add multiple buttons
            with different styles and actions.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Custom Footer Actions:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Multiple action buttons</li>
              <li>• Different button styles (primary, secondary, danger)</li>
              <li>• Custom click handlers</li>
              <li>• Consistent spacing and alignment</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/**
 * Usage Examples for Developers:
 * 
 * 1. Basic Modal:
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Modal Title"
 *   subtitle="Optional subtitle"
 *   size="md"
 * >
 *   <YourContent />
 * </Modal>
 * 
 * 2. Confirm Modal:
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleConfirm}
 *   title="Confirm Action"
 *   message="Are you sure?"
 *   variant="danger"
 * />
 * 
 * 3. Info Modal:
 * <InfoModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Information"
 *   message="Important info here"
 * />
 * 
 * 4. Custom Modal with Footer:
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Custom Modal"
 *   showFooter={true}
 *   footerActions={<YourCustomActions />}
 * >
 *   <YourContent />
 * </Modal>
 */
