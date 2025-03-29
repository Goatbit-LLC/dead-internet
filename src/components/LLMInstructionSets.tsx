import React, { useState } from 'react';
import { Save, Trash2, X, Plus, Edit, Check, Search } from 'lucide-react';
import { useLLMStore } from '../store/llm';
import { formatDistanceToNow } from 'date-fns';

interface LLMInstructionSetsProps {
  onClose: () => void;
}

export const LLMInstructionSets: React.FC<LLMInstructionSetsProps> = ({ onClose }) => {
  const { config, addInstructionSet, updateInstructionSet, deleteInstructionSet, selectInstructionSet } = useLLMStore();
  const [showEditor, setShowEditor] = useState(false);
  const [editingSet, setEditingSet] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSets = config.instructionSets.filter(set => 
    set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.instructions.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!title.trim()) return;

    if (editingSet) {
      updateInstructionSet(editingSet, title.trim(), instructions);
    } else {
      const newSet = addInstructionSet(title.trim(), instructions);
      selectInstructionSet(newSet.id);
    }
    setShowEditor(false);
    setEditingSet(undefined);
    setTitle('');
    setInstructions('');
  };

  const handleEdit = (id: string) => {
    const set = config.instructionSets.find(s => s.id === id);
    if (set) {
      setEditingSet(id);
      setTitle(set.name);
      setInstructions(set.instructions);
      setShowEditor(true);
    }
  };

  const handleDelete = (id: string) => {
    deleteInstructionSet(id);
    setShowConfirmDelete(null);
  };

  const handleCreateNew = () => {
    setEditingSet(undefined);
    setTitle('');
    setInstructions('');
    setShowEditor(true);
  };

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Instruction Sets</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {config.instructionSets.length} set{config.instructionSets.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            New Set
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instruction sets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {filteredSets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No instruction sets match your search' : 'No instruction sets yet'}
            </p>
            <button
              onClick={handleCreateNew}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Create your first set
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSets.map(set => (
              <div
                key={set.id}
                className={`border dark:border-gray-700 rounded-lg p-4 ${
                  config.selectedInstructionSet === set.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{set.name}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(set.id)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(set.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Last updated {formatDistanceToNow(new Date(set.updatedAt))} ago
                </p>
                
                <div className="h-24 mb-3 overflow-hidden text-sm text-gray-600 dark:text-gray-300">
                  <div className="line-clamp-4 font-mono text-xs">
                    {set.instructions}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {config.selectedInstructionSet === set.id ? (
                    <button
                      onClick={() => selectInstructionSet(undefined)}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-900/60 flex items-center gap-1"
                    >
                      <Check size={14} />
                      Active
                    </button>
                  ) : (
                    <button
                      onClick={() => selectInstructionSet(set.id)}
                      className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                    >
                      Use This Set
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingSet ? 'Edit Instruction Set' : 'New Instruction Set'}
              </h3>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this instruction set"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Enter instructions for the LLM..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!title.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Delete Instruction Set
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this instruction set? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => showConfirmDelete && handleDelete(showConfirmDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};