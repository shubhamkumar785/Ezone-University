import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import Button from './Button';

const Filters = ({ 
  searchValue = '', 
  onSearchChange, 
  searchPlaceholder = 'Search...', 
  dropdowns = [], 
  onReset 
}) => {
  return (
    <div className="ez-filters-bar">
      <div className="filters-left">
        <div className="filters-search-wrapper">
          <Search size={18} className="filters-search-icon" />
          <input
            type="text"
            className="filters-search-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {dropdowns.map((dd, index) => (
          <select
            key={index}
            className="filters-select"
            value={dd.value}
            onChange={(e) => dd.onChange(e.target.value)}
          >
            <option value="">{dd.placeholder || 'Select Option'}</option>
            {dd.options.map((opt, oIndex) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={oIndex} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        ))}
      </div>
      {onReset && (
        <Button onClick={onReset} variant="secondary" className="filters-reset-btn">
          <RotateCcw size={14} />
          <span>Reset</span>
        </Button>
      )}
    </div>
  );
};

export default Filters;
