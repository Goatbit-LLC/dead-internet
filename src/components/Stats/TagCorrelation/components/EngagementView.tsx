import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTagCorrelation } from '../context';

export const EngagementView: React.FC = () => {
  const { engagementData } = useTagCorrelation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={engagementData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="tag"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
        <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                <p className="font-medium dark:text-white">#{label}</p>
                <div className="mt-2 space-y-1">
                  {payload.map((entry, index) => (
                    <p
                      key={index}
                      className="text-sm"
                      style={{ color: entry.color }}
                    >
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                </div>
              </div>
            );
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="likes" fill="#3b82f6" name="Likes" />
        <Bar yAxisId="right" dataKey="comments" fill="#ef4444" name="Comments" />
      </BarChart>
    </ResponsiveContainer>
  );
};