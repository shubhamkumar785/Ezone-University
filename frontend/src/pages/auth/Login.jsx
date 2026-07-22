import React, { useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setUserId('');
    setOtp('');
    setOtpSent(false);
    setError('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('ID is required');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      await authService.sendOtp(userId.trim());
      setOtpSent(true);
      toast.success('OTP sent successfully to your registered email');
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.verifyOtp(userId.trim(), otp.trim(), role);
      
      // Ensure the role matches the selected role on the UI to prevent logging in as a student using a teacher ID 
      // if the backend allows cross-role IDs (depends on backend logic, but good for UX)
      if (response.role.toLowerCase() !== role) {
        toast.warning(`Logged in as ${response.role}, redirecting to appropriate dashboard...`);
      } else {
        toast.success('Login successful!');
      }
      
      login(response);
      
      // Explicitly navigate to the appropriate dashboard based on role
      switch(response.role.toUpperCase()) {
        case 'STUDENT': navigate('/student/dashboard', { replace: true }); break;
        case 'TEACHER': navigate('/teacher/dashboard', { replace: true }); break;
        case 'ADMIN': navigate('/admin/dashboard', { replace: true }); break;
        default: navigate('/login', { replace: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Invalid or expired OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = () => {
    switch (role) {
      case 'teacher': return 'Teacher ID';
      case 'admin': return 'Admin ID';
      default: return 'Student ID';
    }
  };

  const getPlaceholder = () => {
    switch (role) {
      case 'teacher': return 'e.g. TCH2024015';
      case 'admin': return 'e.g. ADM2024001';
      default: return 'e.g. STU2024001';
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="logo-container">
            <div className="logo-icon-bg">
              <Shield className="logo-icon" size={24} />
            </div>
            <span className="logo-text">EZone</span>
          </div>

          <h1 className="hero-title">
            Welcome to<br />EZone<br/>
          </h1>
          
          <p className="hero-subtitle">
            A complete enterprise ERP solution for modern universities — streamlining academics, administration, and finance in one unified platform.
          </p>

          <div className="footer-text">
            © 2026 EZone University ERP. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <div className="login-form-container">
          <h2 className="form-title">Sign In to EZone</h2>
          <p className="form-subtitle">
            Enter your {getLabel()} to receive an OTP on your registered email.
          </p>

          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
              disabled={loading}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-tab ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('teacher')}
              disabled={loading}
            >
              Teacher
            </button>
            <button
              type="button"
              className={`role-tab ${role === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('admin')}
              disabled={loading}
            >
              Admin
            </button>
          </div>

          <form className="form-wrapper" onSubmit={otpSent ? handleLogin : handleSendOtp}>
            <div className="form-inputs">
              <Input
                label={getLabel()}
                placeholder={getPlaceholder()}
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (error) setError('');
                }}
                error={!otpSent ? error : ''}
                disabled={otpSent || loading}
              />
              
              {otpSent && (
                <div className="otp-animation-wrapper">
                  <Input
                    label="OTP"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (error) setError('');
                    }}
                    error={error}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="submit-btn" variant="primary" disabled={loading}>
              {loading ? <Loader /> : (
                <>{otpSent ? 'Sign In' : 'Send OTP'} <ArrowRight size={18} className="btn-icon" /></>
              )}
            </Button>
          </form>

          <div className="no-registration-text">
            No self-registration. Contact your administrator.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
