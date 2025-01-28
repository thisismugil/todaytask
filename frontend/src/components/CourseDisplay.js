import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CourseDisplay = () => {
  const { courseId } = (useLocation()).state;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        console.log('Fetching course details for ID:', courseId); // Log the ID
        const response = await fetch(` http://127.0.0.1:8000/api/student/fetch-course/${courseId}`, {method: "GET"});
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">{course.course_name}</h1>
      <p className="text-gray-700 mb-4">{course.description}</p>
      <p className="text-gray-600 font-medium">Category: {course.category}</p>
      <p className="text-gray-600 font-medium">Modules: {course["Number of modules"]}</p>
      <div className="mt-6">
        {course.content.map((module, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{module.name}</h2>
            <p className="text-gray-700 mt-2">{module.content}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
      >
        Go Back
      </button>
    </div>
  );
};

export default CourseDisplay;