import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { useTagCorrelation } from '../context';

export const DemographicsView: React.FC = () => {
  const { demographicsData, COLORS } = useTagCorrelation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={demographicsData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="tag"
          type="category"
          width={100}
          tick={({ x, y, payload }) => (
            <text x={x} y={y} dy={4} textAnchor="end" fill="#666" fontSize={12}>
              #{payload.value}
            </text>
          )}
        />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            const data = demographicsData.find(d => d.tag === label);
            if (!data) return null;

            return (
              <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                <p className="font-medium dark:text-white">#{label}</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender Distribution</p>
                    <div className="space-y-1">
                      {Object.entries(data.genders).map(([gender, count]) => (
                        <p key={gender} className="text-sm">
                          {gender}: {count} users ({((count / data.total!) * 100).toFixed(1)}%)
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Age Distribution</p>
                    <div className="space-y-1">
                      {Object.entries(data.ageRanges).map(([range, count]) => (
                        <p key={range} className="text-sm">
                          {range}: {count} users ({((count / data.total!) * 100).toFixed(1)}%)
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Regions</p>
                    <div className="space-y-1">
                      {Object.entries(data.regions)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([region, count]) => (
                          <p key={region} className="text-sm">
                            {region}: {count} users ({((count / data.total!) * 100).toFixed(1)}%)
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="total" fill="#3b82f6">
          {demographicsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};