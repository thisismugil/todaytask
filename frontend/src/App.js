import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, } from 'react-router-dom';
import Landingpage from './components/Landingpage';
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
import StudentDash from './components/StudentDash';
import Hostdashboard from './components/Hostdashboard'
import UploadCourse from './components/UploadCourse';
import Mycourses from './components/Mycourses';
import CourseDisplay from './components/CourseDisplay';
import Contents from './components/Contents';


function filterPath(pathName) {
  return window.location.href.includes(pathName)
}

const App = () => {

const [sidebar, setsidebar] = useState(false);

useEffect(() => {
  if (([ 'myCourses', '/uploadCourse'].filter(filterPath)).length !== 0) {
    setsidebar(true);
  } else {
    setsidebar(false);
  }
}, [window.location.href]);

  return (
    <Router >
      <div className='flex min-h-screen'>
        {/* Sidebar */}
          <div className={`${sidebar ? "block" : "hidden"}  w-1/4 bg-gray-800 text-white px-4`}>
            <div className="fixed top-4">
              <h2 className="text-lg font-bold mb-4">Instructor Dashboard</h2>
              <ul>
                <li className={`p-2 cursor-pointer ${window.location.href.includes("uploadCourse") ? "bg-gray-600" : ""}`} onClick={() => window.location.href = "/uploadCourse"}>Upload Course</li>
                <li className={`p-2 cursor-pointer ${window.location.href.includes("myCourses") ? "bg-gray-600" : ""}`} onClick={() => window.location.href = "/myCourses"}>My Courses</li>
                {/* <li className={`p-2 cursor-pointer ${window.location.href.includes("allCourse") ? "bg-gray-600" : ""}`} onClick={() => window.location.href = "/allCourse"}>All Courses</li> */}
              </ul>
            </div>
          </div>
        <div className='flex-1'>
          <Routes>
          <Route path="/" element={<Landingpage />} />
            <Route path="/register" element={<Register />} />
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
            <Route path="/StudentDash" element={<StudentDash />} />
            <Route path='/hostDash' element={<Hostdashboard />} />
            <Route path='/uploadCourse' element={<UploadCourse />} />
            <Route path='/myCourses' element={<Mycourses />} />
            {/* <Route path='/allCourse' element={<Allcourse />} /> */}
            <Route path='/CourseDisplay' element={<CourseDisplay />} />
            <Route path='/Contents/:id' element={<Contents />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
