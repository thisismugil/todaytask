// CourseDisplay.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar'; // Adjust the path if necessary

const CourseDisplay = () => {
  const { courseId } = (useLocation()).state;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(0); // State to hold the selected module index
  const [showDialog, setShowDialog] = useState(false); // State to control the dialog box
  const userEmail = 'user@example.com'; // Replace with actual user email logic

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        console.log('Fetching course details for ID:', courseId); // Log the ID
        const response = await fetch(`http://127.0.0.1:8000/api/student/fetch-course/${courseId}`, { method: "GET" });
        const text = await response.text(); // Get raw response text
        console.log('Raw response:', text); // Log raw response
        const data = JSON.parse(text); // Parse JSON from raw text
        if (response.ok) {
          setCourse(data);
        } else {
          console.error('Error fetching course details:', data);
          setCourse(null);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return <p className="text-center text-red-500">Course not found</p>;
  }

  const handleModuleSelect = (index) => {
    setSelectedModule(index);
  };

  const handleNextModule = () => {
    if (selectedModule < course.content.length - 1) {
      setSelectedModule(selectedModule + 1);
    }
  };

  const handleFinishCourse = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    navigate(-1); // Navigate back after closing the dialog
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      <Sidebar
        modules={course.content}
        selectedModule={selectedModule}
        onModuleSelect={handleModuleSelect}
      />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">{course.course_name}</h1>
        <p className="text-gray-700 mb-4">{course.description}</p>
        <p className="text-gray-600 font-medium">Category: {course.category}</p>
        <p className="text-gray-600 font-medium">Modules: {course["Number of modules"]}</p>
        <div className="mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{course.content[selectedModule].name}</h2>
            <p className="text-gray-700 mt-2">{course.content[selectedModule].content}</p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Go Back
          </button>
          {selectedModule < course.content.length - 1 ? (
            <button
              onClick={handleNextModule}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinishCourse}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Finish
            </button>
          )}
        </div>
      </div>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <img src="/trophy.png" alt="Congratulations" className="mx-auto mb-4 max-w-xs max-h-48" />
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-gray-700 mb-6">You have successfully completed the course.</p>
            <button
              onClick={closeDialog}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDisplay;
