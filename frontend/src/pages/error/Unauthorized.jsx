import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', textAlign: 'center',
      backgroundColor: '#f9fafb', padding: '2rem'
    }}>
      <Shield size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111827' }}>
        Unauthorized Access
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '400px' }}>
        You do not have the required permissions to view this page. Please return to your designated dashboard or login with appropriate credentials.
      </p>

      <Button onClick={() => navigate(-1)} variant="primary" style={{ width: 'auto' }}>
        Go Back
      </Button>
    </div>
  );
};

export default Unauthorized;
