import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';

const UploadAssignment = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedSection || !title || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Simulate API call
    toast.success(`Assignment "${title}" uploaded to ${selectedSection}`);
    navigate('/teacher/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/teacher/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <ArrowLeft size={20} color="#333" />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#333', margin: 0 }}>
            Upload Section-wise Assignment
          </h1>
        </div>

        {/* Upload Form */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px' }}>Target Section *</label>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              >
                <option value="">-- Select Section --</option>
                <option value="CSE-B">Computer Science - Section B</option>
                <option value="ECE-A">Electronics - Section A</option>
                <option value="MECH-C">Mechanical - Section C</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px' }}>Due Date *</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px' }}>Assignment Title *</label>
            <input 
              type="text" 
              placeholder="e.g., Data Structures Homework 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px' }}>Instructions / Description</label>
            <textarea 
              placeholder="Enter assignment instructions here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px' }}>Attachment (Optional)</label>
            
            {!selectedFile ? (
              <div style={{ 
                border: '2px dashed #CBD5E1', borderRadius: '8px', padding: '32px', textAlign: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer', position: 'relative'
              }}>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <Upload size={32} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#475569', fontWeight: 500 }}>Click or drag file to upload</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>PDF, DOCX, or ZIP (Max 10MB)</p>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', backgroundColor: '#DBEAFE', borderRadius: '8px' }}>
                    <FileText size={24} color="#3B82F6" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedFile.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', color: '#94A3B8' }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '24px', borderTop: '1px solid #E0E0E0' }}>
            <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>Cancel</Button>
            <Button variant="primary" onClick={handleUpload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} /> Upload Assignment
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadAssignment;
