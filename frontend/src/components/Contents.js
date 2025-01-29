import { useLocation } from "react-router-dom";

export default function Contents() {
    const location = useLocation();
    const course = location.state.course;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-yellow-800 mb-6" >{course.course_name}</h1>
            <p className="text-gray-600 text-lg mb-4">Category: <span className="font-medium">{course.category}</span></p>
            <p className="text-gray-600 text-lg mb-4">Description: <span className="font-medium">{course.description}</span></p>
            <p className="text-gray-600 text-lg mb-4">Price: <span className="font-medium">${course.price}</span></p>
            <p className="text-gray-600 text-lg mb-4">Modules: <span className="font-medium">{course["Number of modules"]}</span></p>
            <p className="text-gray-600 text-lg mb-4">Courses: </p>
            <ul className="">
                {
                    course.content.map((item, key) => (
                        <li className="text-gray-600 font-medium mb-10">
                            <div>
                                <h4 className="text-xl font-semibold text-blue-800 mb-2">
                                    {key + 1}.{item.name}
                                </h4>
                                <p className="text-gray-600 text-sm">{item.content}</p>
                            </div>
                            
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
