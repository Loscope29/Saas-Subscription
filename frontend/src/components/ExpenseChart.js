import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', cost: 40 },
  { month: 'Fév', cost: 45 },
  { month: 'Mar', cost: 60 },
  { month: 'Avr', cost: 55 },
  { month: 'Mai', cost: 70 },
  { month: 'Juin', cost: 75 },
  { month: 'Juil', cost: 80 },
  { month: 'Août', cost: 70 },
  { month: 'Sep', cost: 85 },
];

const ExpenseChart = ({ currentMonthlyCost }) => {
  // Use mock data but adjust the last month to the current real data if available
  const data = [...mockData];
  if (currentMonthlyCost) {
    data[data.length - 1].cost = parseFloat(currentMonthlyCost);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
          tickFormatter={(value) => `${value}€`}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
          itemStyle={{ color: '#4f46e5', fontWeight: '900' }}
          formatter={(value) => [`${value}€`, 'Dépense']}
        />
        <Area 
          type="monotone" 
          dataKey="cost" 
          stroke="#4f46e5" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorCost)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
