import React from 'react';
import { useNavigate } from 'react-router-dom';

const FirstPage = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === 'student') {
            navigate('/loginstudent');
        } else if (role === 'instructor') {
            navigate('/login');
        }
    };

    return (
        <div className="role-container">
            <h1>Select Your Role</h1>
            <button onClick={() => handleRoleSelection('student')}>Student</button>
            <button onClick={() => handleRoleSelection('instructor')}>Instructor</button>
        </div>
    );
};

export default FirstPage;