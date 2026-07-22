import React, { useState } from 'react';
import Button from '../common/Button';
import { Download, FileDown } from 'lucide-react';

const ExportDialog = ({ category = 'Students', data = [], onCancel }) => {
  const [format, setFormat] = useState('CSV');

  const handleExport = () => {
    if (data.length === 0) return;

    if (format === 'CSV') {
      const headers = Object.keys(data[0]);
      const csvRows = [];
      
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header];
          const escaped = ('' + val).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      const csvData = csvRows.join('\n');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ezone_${category.toLowerCase()}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ezone_${category.toLowerCase()}_export.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="export-dialog-wrapper">
      <h3 className="form-modal-title">Bulk Export Data</h3>
      
      <div className="export-preview-card">
        <FileDown size={32} className="export-preview-icon" />
        <div className="export-preview-info">
          <span className="export-preview-heading">Ready for Download</span>
          <span className="export-preview-sub">
            Target Category: <strong>{category}</strong> • <strong>{data.length}</strong> matching records.
          </span>
        </div>
      </div>

      <div className="export-options-form">
        <label className="ez-input-label">Select Export Format</label>
        <div className="export-format-options">
          <label className="format-option">
            <input 
              type="radio" 
              name="exportFormat" 
              value="CSV" 
              checked={format === 'CSV'} 
              onChange={() => setFormat('CSV')} 
            />
            <div className="format-label-box">
              <span className="format-label-title">CSV Format</span>
              <span className="format-label-desc">Comma-separated values spreadsheet</span>
            </div>
          </label>

          <label className="format-option">
            <input 
              type="radio" 
              name="exportFormat" 
              value="JSON" 
              checked={format === 'JSON'} 
              onChange={() => setFormat('JSON')} 
            />
            <div className="format-label-box">
              <span className="format-label-title">JSON Format</span>
              <span className="format-label-desc">Structured raw JSON data string</span>
            </div>
          </label>
        </div>
      </div>

      <div className="form-actions-row">
        <Button onClick={onCancel} variant="secondary" className="form-cancel-btn">
          Cancel
        </Button>
        <Button 
          onClick={handleExport} 
          variant="primary" 
          className="form-submit-btn" 
          disabled={data.length === 0}
        >
          <Download size={16} />
          <span>Download File</span>
        </Button>
      </div>
    </div>
  );
};

export default ExportDialog;
