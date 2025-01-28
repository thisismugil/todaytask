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
            <p>Welcome to our dash</p>
        </div>
    );
};

export default UploadCourse;
