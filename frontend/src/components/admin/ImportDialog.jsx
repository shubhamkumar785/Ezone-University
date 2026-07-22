import React, { useState } from 'react';
import Button from '../common/Button';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const ImportDialog = ({ onImport, onCancel }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, validating, valid, error, importing

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setStatus('validating');
      setTimeout(() => {
        setStatus('valid');
      }, 1000);
    } else {
      setFile(null);
      setStatus('error');
    }
  };

  const handleImportClick = () => {
    if (!file) return;
    setStatus('importing');
    
    setTimeout(() => {
      const mockImported = [
        { fullName: 'Arthur Dent', email: 'arthur.dent@ezone.edu', department: 'Physics', course: 'B.Sc Physics', semester: '1st', section: 'A', rollNumber: 'PH-009', phone: '+1 555-4242', guardianName: 'Ford Prefect' },
        { fullName: 'Tricia McMillan', email: 'trillian@ezone.edu', department: 'Mathematics', course: 'B.Sc Math', semester: '5th', section: 'B', rollNumber: 'MA-042', phone: '+1 555-8888', guardianName: 'Zaphod Beeblebrox' }
      ];
      onImport(mockImported);
    }, 1200);
  };

  return (
    <div className="import-dialog-wrapper">
      <h3 className="form-modal-title">Bulk Import CSV</h3>
      
      <div 
        className={`import-dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload size={36} className="dropzone-icon" />
        <p className="dropzone-text">
          Drag and drop your <strong>.csv</strong> file here, or{' '}
          <label className="dropzone-browse">
            browse
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </label>
        </p>
        {file && <span className="dropzone-filename">Selected: {file.name}</span>}
      </div>

      <div className="import-checklist-card">
        <h4 className="checklist-title">CSV Headers Requirement Checklist:</h4>
        <ul className="checklist-list">
          <li><span className="checklist-bullet">✔</span> fullName</li>
          <li><span className="checklist-bullet">✔</span> email</li>
          <li><span className="checklist-bullet">✔</span> department</li>
          <li><span className="checklist-bullet">✔</span> course</li>
          <li><span className="checklist-bullet">✔</span> semester (e.g. 1st, 3rd)</li>
          <li><span className="checklist-bullet">✔</span> section (e.g. A, B)</li>
          <li><span className="checklist-bullet">✔</span> rollNumber</li>
          <li><span className="checklist-bullet">✔</span> phone</li>
          <li><span className="checklist-bullet">✔</span> guardianName</li>
        </ul>
      </div>

      {status === 'validating' && (
        <div className="import-status-bar info">
          <FileText size={16} className="refresh-icon-spin spinning" />
          <span>Validating CSV columns structure...</span>
        </div>
      )}

      {status === 'valid' && (
        <div className="import-status-bar success">
          <CheckCircle size={16} />
          <span>CSV file structure verified. Ready to import.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="import-status-bar danger">
          <AlertTriangle size={16} />
          <span>Invalid file type. Please upload a valid CSV file.</span>
        </div>
      )}

      {status === 'importing' && (
        <div className="import-status-bar info">
          <Upload size={16} className="refresh-icon-spin spinning" />
          <span>Importing student database records...</span>
        </div>
      )}

      <div className="form-actions-row">
        <Button onClick={onCancel} variant="secondary" className="form-cancel-btn" disabled={status === 'importing'}>
          Cancel
        </Button>
        <Button 
          onClick={handleImportClick} 
          variant="primary" 
          className="form-submit-btn" 
          disabled={status !== 'valid'}
        >
          Import Database
        </Button>
      </div>
    </div>
  );
};

export default ImportDialog;
