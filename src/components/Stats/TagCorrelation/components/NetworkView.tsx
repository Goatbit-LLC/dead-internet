import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer
} from 'recharts';
import { useTagCorrelation } from '../context';

export const NetworkView: React.FC = () => {
  const { nodes, links } = useTagCorrelation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis type="number" dataKey="x" domain={[0, 400]} hide />
        <YAxis type="number" dataKey="y" domain={[0, 400]} hide />
        <ZAxis type="number" dataKey="z" range={[30, 100]} />
        <Tooltip
          content={({ payload }) => {
            if (!payload?.[0]?.payload) return null;
            const { name, z } = payload[0].payload;
            return (
              <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded border dark:border-gray-700">
                <p className="font-medium dark:text-white">#{name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Used in {z} post{z !== 1 ? 's' : ''}
                </p>
              </div>
            );
          }}
        />
        {links.map((line, i) => (
          <Line
            key={i}
            type="linear"
            dataKey="value"
            stroke="#94a3b8"
            strokeWidth={Math.min(line.value * 2, 8)}
            opacity={0.2}
            data={[
              { value: line.value, x: nodes.find(n => n.id === line.source)?.x, y: nodes.find(n => n.id === line.source)?.y },
              { value: line.value, x: nodes.find(n => n.id === line.target)?.x, y: nodes.find(n => n.id === line.target)?.y }
            ]}
            dot={false}
          />
        ))}
        <Scatter
          data={nodes.map(node => ({ ...node, z: node.count }))}
          fill="#3b82f6"
          label={({ name }) => `#${name}`}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};