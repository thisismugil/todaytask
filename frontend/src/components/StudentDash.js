import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data logic here
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Session management
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.removeItem('user'); // Clear user session
        navigate('/loginSt'); // Redirect to login after inactivity
      }, 6000); // 1 minute
    };

    // Event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Start the timer
    resetTimer();

    // Cleanup event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost/api/student/logout_user');
      localStorage.removeItem('user');
      navigate('/loginSt');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Welcome to Our Platform</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8">
        <p className="text-xl font-medium text-gray-700 mb-4">
          Hello, welcome back to our amazing application!
        </p>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">&copy; 2025 Our Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
