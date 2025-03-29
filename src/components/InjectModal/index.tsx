import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserInject } from './UserInject';
import { PostInject } from './PostInject';
import { EventInject } from './EventInject';
import { InstructionInject } from './InstructionInject';

interface InjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InjectType = 'user' | 'post' | 'event' | 'instruction';

export const InjectModal: React.FC<InjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<InjectType | null>(null);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (selectedType) {
      case 'user':
        return <UserInject onClose={() => setSelectedType(null)} />;
      case 'post':
        return <PostInject onClose={() => setSelectedType(null)} />;
      case 'event':
        return <EventInject onClose={() => setSelectedType(null)} />;
      case 'instruction':
        return <InstructionInject onClose={() => setSelectedType(null)} />;
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('user')}
              className="p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">User Injection</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Create a custom user with specific attributes
              </p>
            </button>
            <button
              onClick={() => setSelectedType('post')}
              className="p-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Post Injection</h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Create a custom post from any user
              </p>
            </button>
            <button
              onClick={() => setSelectedType('event')}
              className="p-6 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Event Injection</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Create a custom event to influence user behavior
              </p>
            </button>
            <button
              onClick={() => setSelectedType('instruction')}
              className="p-6 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Instruction Injection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add temporary behavioral instructions
              </p>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold dark:text-white">Content Injection</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {selectedType
                  ? `Create a custom ${selectedType}`
                  : 'Choose what type of content to inject'}
              </p>
            </div>
            <button
              onClick={selectedType ? () => setSelectedType(null) : onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};