import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const StudentDash = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [search, setSearch] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showInactivityDialog, setShowInactivityDialog] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/student/fetch-courses/');
        const coursesWithCount = response.data.courses.map(course => ({
          ...course,
          enrolledCount: [...new Set(course.enrolled_students)].length // Count unique enrolled students
        }));
        setCourses(coursesWithCount);
        setFilteredCourses(coursesWithCount);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    filterCourses();
  }, [category, price, search]);

  const filterCourses = () => {
    let filtered = courses;

    if (category) {
      filtered = filtered.filter(course => course.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (price) {
      filtered = filtered.filter(course => course.price <= price);
    }

    if (search) {
      filtered = filtered.filter(course => course.course_name.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('http://localhost:8000/api/student/enroll-course/', { courseId }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + window.localStorage.getItem("token")
        }
      });
      navigate(`/CourseDisplay`, { state: { courseId } });
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginSt');
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleInactivityLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginSt');
  };

  useEffect(() => {
    let timeoutId;
    let countdownId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      clearInterval(countdownId);
      timeoutId = setTimeout(() => {
        setShowInactivityDialog(true);
        setInactivityCountdown(10);
        countdownId = setInterval(() => {
          setInactivityCountdown(prev => prev - 1);
        }, 1000);
      }, 30000); // 30 seconds
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
      clearInterval(countdownId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [navigate]);

  useEffect(() => {
    if (inactivityCountdown === 0) {
      handleInactivityLogout();
    }
  }, [inactivityCountdown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading courses...</p>
      </div>
    );
  }

  const sortedCourses = [...filteredCourses].sort((a, b) => b.enrolledCount - a.enrolledCount);
  const topThreeCourses = sortedCourses.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <input
            type="text"
            placeholder="Search by course name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded ml-2"
          >
            <option value="">All Categories</option>
            <option value="programming language">Programming Language</option>
            <option value="non circuit">Non Circuit</option>
            <option value="web development">Web Development</option>
            {/* Add more categories as needed */}
          </select>
          <input
            type="number"
            placeholder="Max Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 rounded ml-2"
          />
        </div>
        <div className="text-right flex items-center">
          <i className="fas fa-user-circle text-gray-700 mr-2"></i> {/* Font Awesome user icon */}
          <p className="text-gray-700">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      {showLogoutDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={cancelLogout}
                className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {showInactivityDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg mb-4">You have been inactive for 30 seconds. Logout in {inactivityCountdown} seconds?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInactivityDialog(false)}
                className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleInactivityLogout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course, index) => (
          <div
            key={course._id}
            className={`bg-white shadow-md rounded-lg p-4 ${topThreeCourses.includes(course) ? 'bg-yellow-100' : ''}`}
          >
            {topThreeCourses.includes(course) && (
              <div className="bg-blue-500 text-white py-1 px-2 rounded-t-lg">
                On Demand #{topThreeCourses.indexOf(course) + 1}
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800">{course.course_name}</h2>
            <p className="text-gray-700 mt-2">{course.description}</p>
            <p className="text-gray-600 mt-2">Category: {course.category}</p>
            <div className="mt-2 bg-green-200 text-green-800 py-2 px-4 rounded inline-block">
              Price: ₹{course.price}
            </div>
            <div className="mt-2 bg-blue-200 text-blue-800 py-2 px-4 rounded inline-block">
              Enrolled: {course.enrolledCount}
            </div>
            {course.enrolled_students.includes(userEmail) ? (
              <button
                onClick={() => navigate(`/CourseDisplay`, { state: { courseId: course._id } })}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ml-4"
              >
                Open
              </button>
            ) : (
              <button
                onClick={() => handleEnroll(course._id)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ml-4"
              >
                Enroll
              </button>
            )}
          </div>
        ))}
      </div>.
    </div>
  );
};

export default StudentDash;
