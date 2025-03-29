import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTagCorrelation } from '../context';

export const ActivityView: React.FC = () => {
  const { activityData } = useTagCorrelation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={activityData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                <p className="font-medium dark:text-white">{label}</p>
                <div className="mt-2">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {payload[0].value} posts
                  </p>
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="posts"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};