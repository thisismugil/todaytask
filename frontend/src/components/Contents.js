import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Contents() {
    const location = useLocation();
    const [course, setCourse] = useState(location.state.course);
    const [isEditing, setIsEditing] = useState(false);
    const [editCourse, setEditCourse] = useState({ ...course });

    const handleChange = (e, field) => {
        setEditCourse({ ...editCourse, [field]: e.target.value });
    };

    const handleModuleChange = (e, index, field) => {
        const updatedModules = [...editCourse.content];
        updatedModules[index][field] = e.target.value;
        setEditCourse({ ...editCourse, content: updatedModules });
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/instructor/edit-course/`, editCourse);
            setCourse(editCourse);
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            alert("Error updating course try again");
            console.error("Error updating course:", error);
        }
        setIsEditing(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {!isEditing ? (
                <>
                    {/* Display Course Details */}
                    <h1 className="text-3xl font-bold text-yellow-800 mb-6">{course.course_name}</h1>
                    <p className="text-gray-600 text-lg mb-4">Category: <span className="font-medium">{course.category}</span></p>
                    <p className="text-gray-600 text-lg mb-4">Description: <span className="font-medium">{course.description}</span></p>
                    <p className="text-gray-600 text-lg mb-4">Price: <span className="font-medium">${course.price}</span></p>
                    <p className="text-gray-600 text-lg mb-4">Modules: <span className="font-medium">{course["Number of modules"]}</span></p>
                    <p className="text-gray-600 text-lg mb-4">Courses:</p>
                    <ul>
                        {course.content.map((item, key) => (
                            <li key={key} className="text-gray-600 font-medium mb-10">
                                <h4 className="text-xl font-semibold text-blue-800 mb-2">
                                    {key + 1}.{item.name}
                                </h4>
                                <p className="text-gray-600 text-sm">{item.content}</p>
                            </li>
                        ))}
                    </ul>

                    {/* Edit Button */}
                    <button 
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md mt-4"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                </>
            ) : (
                <>
                    {/* Edit Form */}
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Course</h2>

                        {/* Course Name */}
                        <label className="block text-gray-700 font-medium">Course Name</label>
                        <input
                            type="text"
                            value={editCourse.course_name}
                            onChange={(e) => handleChange(e, "course_name")}
                            className="w-full border p-2 rounded-md mb-4"
                        />

                        {/* Category */}
                        <label className="block text-gray-700 font-medium">Category</label>
                        <input
                            type="text"
                            value={editCourse.category}
                            onChange={(e) => handleChange(e, "category")}
                            className="w-full border p-2 rounded-md mb-4"
                        />

                        {/* Description */}
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={editCourse.description}
                            onChange={(e) => handleChange(e, "description")}
                            className="w-full border p-2 rounded-md mb-4"
                        />

                        {/* Price */}
                        <label className="block text-gray-700 font-medium">Price ($)</label>
                        <input
                            type="number"
                            value={editCourse.price}
                            onChange={(e) => handleChange(e, "price")}
                            className="w-full border p-2 rounded-md mb-4"
                        />

                        {/* Number of Modules */}
                        <label className="block text-gray-700 font-medium">Number of Modules</label>
                        <input
                            type="number"
                            value={editCourse["Number of modules"]}
                            onChange={(e) => handleChange(e, "Number of modules")}
                            className="w-full border p-2 rounded-md mb-4"
                        />

                        {/* Edit Modules */}
                        <h3 className="text-xl font-semibold mt-4 mb-2">Modules</h3>
                        {editCourse.content.map((item, index) => (
                            <div key={index} className="mb-4">
                                {/* Module Name */}
                                <label className="block text-gray-700 font-medium">Module {index + 1} Name</label>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleModuleChange(e, index, "name")}
                                    className="w-full border p-2 rounded-md"
                                />

                                {/* Module Content */}
                                <label className="block text-gray-700 font-medium mt-2">Content</label>
                                <textarea
                                    value={item.content}
                                    onChange={(e) => handleModuleChange(e, index, "content")}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                        ))}

                        {/* Buttons */}
                        <div className="flex gap-4 mt-4">
                            <button 
                                className="bg-green-600 text-white px-4 py-2 rounded-md"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
