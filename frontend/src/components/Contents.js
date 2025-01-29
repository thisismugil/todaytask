import React from "react";
import { useLocation } from "react-router-dom";

const CourseDetail = () => {
    const location = useLocation();
    const course = location.state?.course;

    if (!course) {
        return <div>Course not found.</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{course.course_name}</h1>
            <p className="text-gray-600 mb-2">Category: <span className="font-medium">{course.category}</span></p>
            <p className="text-gray-600 mb-2">Description: <span className="font-medium">{course.description}</span></p>
            <p className="text-gray-600 mb-2">Price: <span className="font-medium">${course.price}</span></p>
            <p className="text-gray-600 mb-2">Modules: <span className="font-medium">{course["Number of modules"]}</span></p>
            <div className="mt-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules and Contents</h2>
                {course.content.map((module, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Module {index + 1}</h3>
                        <p className="text-gray-600">{module}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDetail;
