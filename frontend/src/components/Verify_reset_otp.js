import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyResetOtp = () => {
const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();console.log('Email:', email);
console.log('OTP:', otp);
console.log('Message:', message);
console.log('Error:', error);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/instructor/verify-reset/', { email, otp });
      setMessage(response.data.message);
      navigate('/Reset-pass')
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <label>OTP</label>
        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          required 
        />
        <button type="submit">Verify OTP</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyResetOtp;
