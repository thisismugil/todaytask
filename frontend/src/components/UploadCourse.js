import React, { useState } from "react";

function getUserId() {
    return localStorage.getItem("_id");
}

const UploadCourse = () => {
    const [courseName, setCourseName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [numberOfModules, setNumberOfModules] = useState(0);
    const [modules, setModules] = useState([]);
    const [activeTab, setActiveTab] = useState("upload");

    const handleModuleChange = (e) => {
        const count = parseInt(e.target.value);
        setNumberOfModules(count);
        setModules(new Array(count).fill({ name: "", content: "" }));
    };

    const handleModuleInputChange = (index, field, value) => {
        const updatedModules = [...modules];
        updatedModules[index] = { ...updatedModules[index], [field]: value };
        setModules(updatedModules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserId();
        if (!userId) {
            alert("User id not found .Please login again");
            return;
        }

        const data = {
            course_name: courseName,
            category,
            description,
            number_of_modules: numberOfModules,
            content: modules,
            price,
            user_id: userId
        };

        try {
            const response = await fetch("http://localhost:8000/api/instructor/upload/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.message || result.error);
        } catch (error) {
            console.error("Error uploading course:", error);
            alert("Failed to upload course.");
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-3/4 p-6">
                {activeTab === "upload" && (
                    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Upload Course</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block font-medium">Course Name:</label>
                            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required className="w-full p-2 border rounded" />

                            <label className="block font-medium">Category:</label>
                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border rounded" />

                            <label className="block font-medium">Description:</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded" />

                            <label className="block font-medium">Price:</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border rounded" />

                            <label className="block font-medium">Number of Modules:</label>
                            <select value={numberOfModules} onChange={handleModuleChange} required className="w-full p-2 border rounded">
                                <option value="">Select</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>

                            <div className="space-y-4">
                                {modules.map((module, index) => (
                                    <div key={index} className="p-4 border rounded bg-gray-100">
                                        <label className="block font-medium">Module {index + 1} Name:</label>
                                        <input type="text" value={module.name} onChange={(e) => handleModuleInputChange(index, "name", e.target.value)} required className="w-full p-2 border rounded" />

                                        <label className="block font-medium">Module {index + 1} Content:</label>
                                        <textarea value={module.content} onChange={(e) => handleModuleInputChange(index, "content", e.target.value)} required className="w-full p-2 border rounded" />
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="w-full p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Upload Course</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadCourse;
