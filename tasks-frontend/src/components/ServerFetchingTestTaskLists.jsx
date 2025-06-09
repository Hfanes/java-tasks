"use client";

import React from "react";

export default function TestTaskLists({ taskLists }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-4">Task Lists</h2>
      {taskLists.map((taskList) => (
        <ul
          key={taskList.id}
          className="w-full group flex items-center justify-between h-auto py-2 px-2 hover:bg-gray-100 rounded cursor-pointer transition"
        >
          <>
            <div className="text-left overflow-hidden">
              <h3 className="font-medium truncate">{taskList.title}</h3>
              <p className="text-xs text-gray-500 truncate">
                {taskList.description}
              </p>
            </div>
          </>
        </ul>
      ))}
    </div>
  );
}
