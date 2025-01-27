import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ValidateEmail = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // To navigate to the next page
  const location = useLocation();
  const email = location.state?.email || ''; // Get email from navigation state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/instructor/verify-email-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        navigate('/login'); // Navigate to login page
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h2>Validate Email</h2>
      <p>We’ve sent an OTP to your email: {email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Validate</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ValidateEmail;
