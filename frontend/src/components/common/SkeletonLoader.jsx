import React from 'react';

const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px', style = {} }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#E5E7EB',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style
      }}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #E0E0E0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <SkeletonLoader height="20px" width="70%" style={{ marginBottom: '12px' }} />
      <SkeletonLoader height="16px" width="50%" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <SkeletonLoader height="28px" width="60px" />
        <SkeletonLoader height="28px" width="60px" />
        <SkeletonLoader height="28px" width="80px" />
      </div>
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E0E0E0'
    }}>
      <SkeletonLoader height="24px" width="200px" style={{ marginBottom: '20px' }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ marginBottom: '12px' }}>
          <SkeletonLoader height="48px" width="100%" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
