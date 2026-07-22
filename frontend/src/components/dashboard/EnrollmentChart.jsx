import React, { memo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../common/Card';
import Badge from '../common/Badge';

const EnrollmentChart = ({ data, loading }) => {
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
        <h2 className="chart-card-title">Enrollment Trend</h2>
        <Badge variant="success">Last 12 months</Badge>
      </div>
      <div className="recharts-container">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B3DF5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#5B3DF5" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
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
              domain={['auto', 'auto']}
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
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#5B3DF5" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#enrollmentGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default memo(EnrollmentChart);
