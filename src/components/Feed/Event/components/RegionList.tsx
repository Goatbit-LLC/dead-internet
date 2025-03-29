import React from 'react';
import { MapPin } from 'lucide-react';

interface RegionListProps {
  regions: string[];
}

export const RegionList: React.FC<RegionListProps> = ({ regions }) => {
  if (!regions?.length) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <MapPin size={14} className="text-gray-500 dark:text-gray-400" />
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Affects: {regions.join(', ')}
      </p>
    </div>
  );
};