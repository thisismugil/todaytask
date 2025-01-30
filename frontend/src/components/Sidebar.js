// Sidebar.js
import React from 'react';

const Sidebar = ({ modules, selectedModule, onModuleSelect }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Modules</h2>
      <ul>
        {modules.map((module, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer ${selectedModule === index ? 'bg-gray-700' : ''}`}
            onClick={() => onModuleSelect(index)}
          >
            {module.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
