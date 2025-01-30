
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("_id");

        if (!userId) {
            setError("User ID not found. Please log in again.");
            return;
        }
        axios
            .get(`http://localhost:8000/api/instructor/fetch/${userId}`)
            .then((response) => {
                setCourses(response.data.contents);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setError("Failed to load courses. Please try again later.");
            });
    }, []);

    const handleCourseClick = (course) => {
        navigate(`/Contents/${course._id}`, { state: { course } });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Uploaded Courses</h1>
            {error && <p className="text-red-500 text-lg">{error}</p>}
            {!error && courses.length === 0 && (
                <p className="text-gray-600 text-lg">No courses found. Start uploading to see them here!</p>
            )}
            {courses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => handleCourseClick(course)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.course_name}</h2>
                            <p className="text-gray-600 mb-2">Category: <span className="font-medium">{course.category}</span></p>
                            <p className="text-gray-600 mb-2">Description: <span className="font-medium">{course.description}</span></p>
                            <p className="text-gray-600 mb-2">Price: <span className="font-medium">${course.price}</span></p>
                            <p className="text-gray-600 mt-2">Modules: <span className="font-medium">{course["Number of modules"]}</span></p>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadedCourses;
