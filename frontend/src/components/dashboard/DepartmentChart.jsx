import React, { useState, memo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Card from '../common/Card';
import Badge from '../common/Badge';

const DepartmentChart = ({ data, loading }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (loading) {
    return (
      <Card className="ez-chart-card flex-col-card">
        <div className="chart-card-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-badge"></div>
        </div>
        <div className="skeleton-chart-box-donut"></div>
      </Card>
    );
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="ez-chart-card flex-col-card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">Department Distribution</h2>
        <Badge variant="info">By Students</Badge>
      </div>
      <div className="department-chart-wrapper">
        <div className="pie-chart-relative">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      filter: activeIndex === index ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' : 'none'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-center-text">
            {activeIndex !== null ? (
              <>
                <span className="pie-center-name">{data[activeIndex].name}</span>
                <span className="pie-center-val">{data[activeIndex].value}%</span>
              </>
            ) : (
              <>
                <span className="pie-center-label">Total Depts</span>
                <span className="pie-center-count">{data.length}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="chart-legend-list">
          {data.map((entry, index) => (
            <div 
              key={`legend-${index}`} 
              className="chart-legend-item"
              style={{
                opacity: activeIndex === null || activeIndex === index ? 1 : 0.4,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="chart-legend-color" style={{ backgroundColor: entry.color }}></div>
              <span>{entry.name} ({entry.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default memo(DepartmentChart);
