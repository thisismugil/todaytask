import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Validate_email from './components/Validate_email';
import Login from './components/Login';
import Forgotpass from './components/Forgotpass';
import Verify_reset_otp from './components/Verify_reset_otp';
import Reset_pass from './components/Reset_pass';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/validate-email" element={<Validate_email />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Forgot-pass" element={<Forgotpass />} />
          <Route path="/Verify-reset-otp" element={<Verify_reset_otp />} />
          <Route path="/Reset-pass" element={<Reset_pass />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
