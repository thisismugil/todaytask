import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import Register from './components/Register';
import Validate_email from './components/Validate_email';
import Login from './components/Login';
import Forgotpass from './components/Forgotpass';
import Verify_reset_otp from './components/Verify_reset_otp';
import Reset_pass from './components/Reset_pass';
import ForgotpassSt from './components/ForgotpassSt';
import LoginSt from './components/LoginSt';
import RegisterSt from './components/RegisterSt';
import Reset_passSt from './components/Reset_passSt';
import Validate_emailSt from './components/Validate_emailSt';
import Verify_reset_otpSt from './components/Verify_reset_otpSt';
import StudentDash from './components/StudentDash'
import CourseDisplay from './components/CourseDisplay';



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
          <Route path="/RegisterSt" element={<RegisterSt />} />
          <Route path="/validate-emailSt" element={<Validate_emailSt />} />
          <Route path="/loginSt" element={<LoginSt />} />
          <Route path="/Forgot-passSt" element={<ForgotpassSt />} />
          <Route path="/Verify-reset-otpSt" element={<Verify_reset_otpSt />} />
          <Route path="/Reset-passSt" element={<Reset_passSt />} />
          <Route path="StudentDash" element={<StudentDash />} />
          <Route path="/CourseDisplay" element={<CourseDisplay  />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
