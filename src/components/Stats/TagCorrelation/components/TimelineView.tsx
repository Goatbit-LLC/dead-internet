import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTagCorrelation } from '../context';

export const TimelineView: React.FC = () => {
  const { timelineData } = useTagCorrelation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={timelineData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                <p className="font-medium dark:text-white">{label}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Posts: {payload[0].value}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Likes: {payload[1].value}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Comments: {payload[2].value}
                  </p>
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="posts"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
        <Area
          type="monotone"
          dataKey="likes"
          stackId="2"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
        />
        <Area
          type="monotone"
          dataKey="comments"
          stackId="3"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.3}
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
};