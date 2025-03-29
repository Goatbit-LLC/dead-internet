import React, { useState } from 'react';
import { Save, Upload, Download, X, RefreshCw } from 'lucide-react';
import { useSimulatorStore } from '../store';

interface SaveStateManagerProps {
  onClose: () => void;
}

export const SaveStateManager: React.FC<SaveStateManagerProps> = ({ onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const store = useSimulatorStore();

  const handleExport = () => {
    const data = {
      users: store.users,
      posts: store.posts,
      comments: store.comments,
      events: store.events,
      simulationWeights: store.simulationWeights,
      statsConfig: store.statsConfig,
      recentActions: store.recentActions,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-simulator-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        store.importState(data);
        setIsImporting(false);
        onClose();
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    store.importState({
      users: [],
      posts: [],
      comments: [],
      events: [],
      simulationWeights: store.simulationWeights, // Keep weights but reset data
      statsConfig: store.statsConfig, // Keep config but reset data
      recentActions: []
    });
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold dark:text-white">Save State Manager</h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => setIsExporting(true)}
              className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-3"
            >
              <Download size={20} />
              <div className="text-left">
                <p className="font-medium">Export Current State</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Save the current simulation state to a file
                </p>
              </div>
            </button>

            {isExporting && (
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  This will export all current data, including:
                  <br />• {store.users.length} users
                  <br />• {store.posts.length} posts
                  <br />• {store.comments.length} comments
                  <br />• {store.events.length} events
                  <br />• All configuration settings
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsExporting(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Export
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsImporting(true)}
              className="w-full p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center gap-3"
            >
              <Upload size={20} />
              <div className="text-left">
                <p className="font-medium">Import State</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Load a previously saved simulation state
                </p>
              </div>
            </button>

            {isImporting && (
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Warning: This will replace all current data with the imported state.
                  Make sure to export your current state if you want to keep it.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsImporting(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                    Import
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-3"
            >
              <RefreshCw size={20} />
              <div className="text-left">
                <p className="font-medium">Reset Simulation</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Clear all data and start fresh
                </p>
              </div>
            </button>

            {showResetConfirm && (
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Warning: This will permanently delete all current data:
                  <br />• {store.users.length} users
                  <br />• {store.posts.length} posts
                  <br />• {store.comments.length} comments
                  <br />• {store.events.length} events
                  <br />• All activity history
                  <br /><br />
                  This action cannot be undone. Export your data first if you want to keep it.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium mb-2">Auto-Save</p>
            <p>
              Your simulation state is automatically saved to the browser's local storage.
              Export to a file for permanent backup or to transfer to another device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};