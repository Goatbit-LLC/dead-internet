import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: number) => void;
  title: string;
  description: string;
  min?: number;
  max?: number;
}

export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  min = 1,
  max = 100
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen) {
        const numValue = value === '' ? min : Math.max(min, Math.min(max, parseInt(value) || min));
        onSubmit(numValue);
        onClose();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isOpen, value, min, max, onSubmit, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      setValue('');
    } else {
      const num = parseInt(newValue);
      if (!isNaN(num)) {
        setValue(Math.max(min, Math.min(max, num)).toString());
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={`Enter a number (${min}-${max})`}
            autoFocus
          />
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
          <button
            onClick={() => {
              const numValue = value === '' ? min : Math.max(min, Math.min(max, parseInt(value) || min));
              onSubmit(numValue);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};