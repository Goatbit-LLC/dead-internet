import React from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterCriteria: {
    gender: string;
    region: string;
    ageRange: string;
  };
  onFilterChange: (criteria: { gender: string; region: string; ageRange: string }) => void;
  regions: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filterCriteria,
  onFilterChange,
  regions,
}) => {
  if (!isOpen) return null;

  const ageRanges = ['18-25', '26-35', '36-50', '51+'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Users</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={filterCriteria.gender}
              onChange={(e) => onFilterChange({ ...filterCriteria, gender: e.target.value })}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-disclosed">Non-disclosed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <select
              value={filterCriteria.ageRange}
              onChange={(e) => onFilterChange({ ...filterCriteria, ageRange: e.target.value })}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {ageRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              value={filterCriteria.region}
              onChange={(e) => onFilterChange({ ...filterCriteria, region: e.target.value })}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => {
              onFilterChange({ gender: '', region: '', ageRange: '' });
              onClose();
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg mr-2"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};