"use client";

import React from "react";
import { useState } from "react";

export default function TaskAI({ tasks, setTasks, selectedTaskList }) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskStatus, setTaskStatus] = useState(tasks.taskStatus); // "OPEN" or "CLOSED"
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    taskPriority: "",
    taskStatus: "",
  });
  const [viewMore, setViewMore] = useState(false);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/task-lists/${selectedTaskList.id}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            dueDate,
            taskPriority,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to create task");
      setTitle("");
      setDescription("");
      setDueDate("");
      setTaskPriority("");
      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.log("Error creating task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/task-lists/${selectedTaskList.id}/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete task");
      //new array with all tasks that are not equal to taskId
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.log("Failed to delete task", error);
    }
  };

  const handleEditTask = (e, task) => {
    e.stopPropagation(); // don't trigger parent's click
    e.preventDefault(); // don't submit form or reload
    console.log("clique");
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate || "",
      taskPriority: task.taskPriority || "",
      taskStatus: task.taskStatus || "",
    });
  };

  const handleCancelClick = () => {
    setEditingTaskId(null);
  };

  const handleEditFormChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/task-lists/${selectedTaskList.id}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: taskId,
            title: editFormData.title,
            description: editFormData.description,
            dueDate: editFormData.dueDate,
            taskPriority: editFormData.taskPriority,
            taskStatus: editFormData.taskStatus,
          }),
        }
      );
      if (!response.ok) throw new Error("Error updating task");
      const updatedTask = await response.json();
      setTasks(
        tasks.map((task) => (task.id === editingTaskId ? updatedTask : task))
      );
      setEditingTaskId(null);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const handleToggleComplete = async (task) => {
    console.log("Checkbox clicked", task);
    try {
      const updatedStatus = task.taskStatus === "OPEN" ? "CLOSED" : "OPEN";

      const response = await fetch(
        `http://localhost:8080/task-lists/${selectedTaskList.id}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...task,
            taskStatus: updatedStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed deleting task list");
      console.log("here", response);

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {}
  };

  return (
    <div className="flex-grow p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {selectedTaskList.title}
      </h1>

      <div className="space-y-4 mb-8">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No tasks yet. Add one below!
          </p>
        ) : (
          tasks.map((task) => (
            <ul
              key={task.id}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
            >
              {editingTaskId === task.id ? (
                //Editing
                <>
                  <form
                    className="w-full space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditFormSubmit(task.id);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={editFormData.taskStatus === "CLOSED"}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            taskStatus: e.target.checked ? "CLOSED" : "OPEN",
                          })
                        }
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="title"
                        required
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditFormChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                      />
                      <input
                        type="datetime-local"
                        name="dueDate"
                        value={editFormData.dueDate}
                        onChange={handleEditFormChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <select
                        name="taskPriority"
                        value={editFormData.taskPriority}
                        onChange={handleEditFormChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="LOW">Low Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="HIGH">High Priority</option>
                      </select>
                      <div className="space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                //Read only
                <>
                  {task.taskStatus === "CLOSED" ? (
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.taskStatus === "CLOSED"}
                          onChange={() => handleToggleComplete(task)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-medium ${
                              task.taskStatus === "CLOSED"
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <button
                            onClick={() => setViewMore(!viewMore)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {viewMore ? "Show less" : "View more"}
                          </button>
                        </div>
                      </div>
                      {viewMore && (
                        <div className="mt-4 pl-8 space-y-2">
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {task.dueDate}
                          </p>
                          <p className="text-sm text-gray-500">
                            Priority: {task.taskPriority}
                          </p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => handleEditTask(e, task)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.taskStatus === "CLOSED"}
                          onChange={() => handleToggleComplete(task)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {task.dueDate}
                          </p>
                          <p className="text-sm text-gray-500">
                            Priority: {task.taskPriority}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={(e) => handleEditTask(e, task)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </ul>
          ))
        )}
      </div>

      {isCreating ? (
        <form
          onSubmit={handleCreateTask}
          className="bg-gray-50 p-6 rounded-lg border border-gray-200"
        >
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <span>Add new task</span>
        </button>
      )}
    </div>
  );
}
