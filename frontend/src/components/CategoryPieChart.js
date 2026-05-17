import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6'];

const CategoryPieChart = ({ data }) => {
  // Convert object { "Streaming": 2, "SaaS": 1 } to array [{ name: "Streaming", value: 2 }, ...]
  const chartData = data ? Object.keys(data).map(key => ({
    name: key,
    value: data[key]
  })) : [];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-on-surface-variant italic">
        Aucune donnée de catégorie disponible.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          itemStyle={{ color: '#1e1b4b', fontWeight: 'bold' }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
