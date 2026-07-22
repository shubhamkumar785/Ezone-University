import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ 
  currentPage = 1, 
  totalItems = 0, 
  itemsPerPage = 10, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="ez-pagination-container">
      <div className="pagination-info">
        Showing <span className="pagination-highlight">{startItem}</span> to{' '}
        <span className="pagination-highlight">{endItem}</span> of{' '}
        <span className="pagination-highlight">{totalItems}</span> items
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            variant="secondary"
            className="pagination-btn pagination-nav-btn"
          >
            <ChevronLeft size={16} />
          </Button>
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={currentPage === pageNum ? 'primary' : 'secondary'}
              className={`pagination-btn pagination-num-btn ${
                currentPage === pageNum ? 'active' : ''
              }`}
            >
              {pageNum}
            </Button>
          ))}
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            variant="secondary"
            className="pagination-btn pagination-nav-btn"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
