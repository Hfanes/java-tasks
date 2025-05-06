"use client";

import React from "react";

import { useState } from "react";

export default function TaskLists({
  taskLists,
  setTaskLists,
  onTaskListClick,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskListId, setEditingTaskListId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
  });

  if (taskLists.length === 0) {
    return <p className="text-muted-foreground">No task lists found</p>;
  }

  const handleCreateTaskList = async () => {
    try {
      const response = await fetch("http://localhost:8080/task-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      if (!response.ok) throw new Error("Failed to create task list");
      setTitle("");
      setDescription("");
      const newTaskList = await response.json();
      setTaskLists((prev) => [...prev, newTaskList]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTaskList = async (taskListId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/task-lists/${taskListId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed deleting task list");
      //new array with all tasklists with taskid different from taskListId
      setTaskLists(taskLists.filter((taskList) => taskList.id !== taskListId));
    } catch (error) {
      console.error("Error deleting task list:", error);
    }
  };

  const handleEditTaskList = (e, taskList) => {
    e.stopPropagation(); // don't trigger parent's click
    e.preventDefault(); // don't submit form or reload
    setEditingTaskListId(taskList.id);

    setEditFormData({
      title: taskList.title || "",
      description: taskList.description || "",
    });
  };
  const handleCancelClick = () => {
    setEditingTaskListId(null);
  };

  const handleEditFormChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (taskListId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/task-lists/${taskListId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: taskListId,
            title: editFormData.title,
            description: editFormData.description,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed deleting task list");

      const updatedTaskList = await response.json();
      setTaskLists(
        taskLists.map((taskList) =>
          taskList.id === editingTaskListId ? updatedTaskList : taskList
        )
      );
      setEditingTaskListId(null);
    } catch (error) {
      console.error("Error deleting task list:", error);
    }
  };
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-4">Task Lists</h2>
      {taskLists.map((taskList) => (
        <ul
          key={taskList.id}
          className="w-full group flex items-center justify-between h-auto py-2 px-2 hover:bg-gray-100 rounded cursor-pointer transition"
          onClick={() => {
            if (editingTaskListId === null) {
              //not editing I can click
              onTaskListClick(taskList);
            }
          }}
        >
          {editingTaskListId === taskList.id ? (
            //Editing
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditFormSubmit(taskList.id);
                }}
              >
                <input
                  type="text"
                  name="title"
                  required
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="text-sm px-2 py-1 border rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className="text-sm px-2 py-1 border rounded"
                />
                <button
                  type="submit"
                  className="text-green-600 hover:text-green-800 font-medium mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </form>
            </>
          ) : (
            //Read only
            <>
              <div className="text-left overflow-hidden">
                <h3 className="font-medium truncate">{taskList.title}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {taskList.description}
                </p>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <button
                  className="text-gray-400 cursor-pointer  hover:text-blue-500 transition"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTaskList(e, taskList);
                  }}
                >
                  edit /
                </button>
                <button
                  className="text-gray-400 cursor-pointer hover:text-red-500 transition"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTaskList(taskList.id);
                  }}
                >
                  delete
                </button>
              </div>
            </>
          )}
        </ul>
      ))}
      {isCreating ? (
        <form onSubmit={handleCreateTaskList} className="mt-4">
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="List name"
            className="w-full p-2 border rounded-md mb-2"
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="List description"
            className="w-full p-2 border rounded-md mb-2"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mt-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <div className="w-4 h-4 mr-1" />
          Add new list
        </button>
      )}
    </div>
  );
}
