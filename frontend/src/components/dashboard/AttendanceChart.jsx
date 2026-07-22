import React, { memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';
import Badge from '../common/Badge';

const AttendanceChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="ez-chart-card">
        <div className="chart-card-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-badge"></div>
        </div>
        <div className="skeleton-chart-box"></div>
      </Card>
    );
  }

  return (
    <Card className="ez-chart-card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">Monthly Attendance</h2>
        <Badge variant="warning">Jan–Jul 2026</Badge>
      </div>
      <div className="recharts-container">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10.5, fontWeight: 500 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              tickFormatter={(val) => `${val}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11.5px', fontWeight: 500, color: '#64748B', paddingTop: '10px' }}
            />
            <Bar dataKey="present" name="Present %" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Absent %" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default memo(AttendanceChart);
