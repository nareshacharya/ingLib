import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import type { SavedView } from "../../model/types";
import { dropdownStyles, modalStyles } from "../../styles";

export interface SavedViewsProps {
  views: SavedView[];
  currentViewId?: string;
  onLoadView: (viewId: string) => void;
  onSaveCurrentView: (name: string) => void;
  onUpdateCurrentView: () => void;
  onDeleteView: (viewId: string) => void;
  onSetDefault: (viewId: string) => void;
  onRenameView: (viewId: string, newName: string) => void;
  hasUnsavedChanges: boolean;
  disabled?: boolean;
}

export function SavedViews({
  views,
  currentViewId,
  onLoadView,
  onSaveCurrentView,
  onUpdateCurrentView,
  onDeleteView,
  onSetDefault,
  onRenameView,
  hasUnsavedChanges,
  disabled = false,
}: SavedViewsProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [targetViewId, setTargetViewId] = useState<string>("");
  const [newViewName, setNewViewName] = useState("");

  const currentView = views.find((v) => v.id === currentViewId);

  const handleSaveAs = () => {
    setNewViewName("");
    setShowSaveDialog(true);
  };

  const handleRename = (viewId: string) => {
    const view = views.find((v) => v.id === viewId);
    if (view) {
      setTargetViewId(viewId);
      setNewViewName(view.name);
      setShowRenameDialog(true);
    }
  };

  const handleDelete = (viewId: string) => {
    setTargetViewId(viewId);
    setShowDeleteDialog(true);
  };

  const confirmSave = () => {
    if (newViewName.trim()) {
      onSaveCurrentView(newViewName.trim());
      setShowSaveDialog(false);
      setNewViewName("");
    }
  };

  const confirmRename = () => {
    if (newViewName.trim() && targetViewId) {
      onRenameView(targetViewId, newViewName.trim());
      setShowRenameDialog(false);
      setNewViewName("");
      setTargetViewId("");
    }
  };

  const confirmDelete = () => {
    if (targetViewId) {
      onDeleteView(targetViewId);
      setShowDeleteDialog(false);
      setTargetViewId("");
    }
  };

  const getDisplayText = () => {
    if (currentView) {
      return hasUnsavedChanges ? `${currentView.name} *` : currentView.name;
    }
    return hasUnsavedChanges ? "Unsaved View *" : "Default View";
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={dropdownStyles.trigger}
          disabled={disabled}
          aria-label="Manage saved views"
        >
          <span className="flex-1 text-left truncate">{getDisplayText()}</span>
          <span className="flex-shrink-0 text-gray-400">▼</span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={`${dropdownStyles.content} min-w-[220px]`}
            align="start"
            sideOffset={4}
          >
            {/* Current view actions */}
            {currentView && (
              <>
                <DropdownMenu.Item
                  className={dropdownStyles.item}
                  onSelect={onUpdateCurrentView}
                  disabled={!hasUnsavedChanges}
                >
                  💾 Update "{currentView.name}"
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={dropdownStyles.separator} />
              </>
            )}

            {/* Views list */}
            {views.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Views
                </div>
                {views.map((view) => (
                  <DropdownMenu.Sub key={view.id}>
                    <DropdownMenu.SubTrigger
                      className={`${dropdownStyles.item} ${
                        view.id === currentViewId
                          ? "bg-blue-50 text-blue-900"
                          : ""
                      }`}
                    >
                      <span className="flex-1 truncate">
                        {view.isDefault && "⭐ "}
                        {view.name}
                      </span>
                      <span className="text-gray-400">▶</span>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.SubContent
                        className={dropdownStyles.content}
                        sideOffset={2}
                        alignOffset={-5}
                      >
                        <DropdownMenu.Item
                          className={dropdownStyles.item}
                          onSelect={() => onLoadView(view.id)}
                        >
                          Load View
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className={dropdownStyles.item}
                          onSelect={() => onSetDefault(view.id)}
                          disabled={view.isDefault}
                        >
                          Set as Default
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator
                          className={dropdownStyles.separator}
                        />
                        <DropdownMenu.Item
                          className={dropdownStyles.item}
                          onSelect={() => handleRename(view.id)}
                        >
                          Rename...
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className={dropdownStyles.itemDestructive}
                          onSelect={() => handleDelete(view.id)}
                        >
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Sub>
                ))}
                <DropdownMenu.Separator className={dropdownStyles.separator} />
              </>
            )}

            {/* Action items */}
            <DropdownMenu.Item
              className={dropdownStyles.item}
              onSelect={handleSaveAs}
            >
              💾 Save current as...
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Save Dialog */}
      <Dialog.Root open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className={modalStyles.overlay} />
          <Dialog.Content className={`${modalStyles.content} max-w-md`}>
            <div className={modalStyles.header}>
              <Dialog.Title className={modalStyles.title}>
                Save Current View
              </Dialog.Title>
              <Dialog.Description className={modalStyles.description}>
                Enter a name for the current filter and column configuration.
              </Dialog.Description>
            </div>

            <div className="py-4">
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="View name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmSave();
                  }
                }}
                autoFocus
              />
            </div>

            <div className={modalStyles.footer}>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!newViewName.trim()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save View
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Rename Dialog */}
      <Dialog.Root open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className={modalStyles.overlay} />
          <Dialog.Content className={`${modalStyles.content} max-w-md`}>
            <div className={modalStyles.header}>
              <Dialog.Title className={modalStyles.title}>
                Rename View
              </Dialog.Title>
              <Dialog.Description className={modalStyles.description}>
                Enter a new name for this view.
              </Dialog.Description>
            </div>

            <div className="py-4">
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="View name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmRename();
                  }
                }}
                autoFocus
              />
            </div>

            <div className={modalStyles.footer}>
              <button
                onClick={() => setShowRenameDialog(false)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                disabled={!newViewName.trim()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rename
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Dialog */}
      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className={modalStyles.overlay} />
          <Dialog.Content className={`${modalStyles.content} max-w-md`}>
            <div className={modalStyles.header}>
              <Dialog.Title className={modalStyles.title}>
                Delete View
              </Dialog.Title>
              <Dialog.Description className={modalStyles.description}>
                Are you sure you want to delete this view? This action cannot be
                undone.
              </Dialog.Description>
            </div>

            <div className={modalStyles.footer}>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete View
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
