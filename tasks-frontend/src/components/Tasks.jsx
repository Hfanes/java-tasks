"use client";

import React from "react";
import { useState } from "react";

export default function Tasks({ tasks, setTasks, selectedTaskList }) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
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
    <div className="flex-grow p-8">
      <h1 className="text-2xl font-bold mb-6">{selectedTaskList.title}</h1>

      <div className="space-y-2 mb-8">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one below!</p>
        ) : (
          tasks.map((task) => (
            <ul
              key={task.id}
              className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-100 rounded border rounded-md"
            >
              {editingTaskId === task.id ? (
                //Editing
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditFormSubmit(task.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editFormData.taskStatus === "CLOSED"}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          taskStatus: e.target.checked ? "CLOSED" : "OPEN",
                        })
                      }
                    />
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
                    <input
                      type="datetime-local"
                      name="dueDate"
                      value={editFormData.dueDate}
                      onChange={handleEditFormChange}
                      className="text-sm px-2 py-1 border rounded"
                    />
                    <label>
                      Priority:
                      <select
                        name="taskPriority"
                        value={editFormData.taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </label>
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
                  {task.taskStatus === "CLOSED" ? (
                    //If finnish only shows title & view more
                    <div className="text-left overflow-hidden">
                      <form>
                        <input
                          type="checkbox"
                          checked={task.taskStatus === "CLOSED"}
                          onChange={() => handleToggleComplete(task)}
                        />
                      </form>
                      <h3
                        className={
                          task.taskStatus === "CLOSED"
                            ? "line-through text-gray-400"
                            : ""
                        }
                      >
                        {task.title}
                      </h3>
                      <a
                        onClick={() => {
                          setViewMore(!viewMore);
                        }}
                      >
                        View more
                      </a>
                      {viewMore && (
                        <>
                          <div className="text-left overflow-hidden">
                            <p className="text-xs text-gray-500 truncate">
                              {task.description}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {task.dueDate}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {task.taskPriority}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {task.taskStatus}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 ml-2">
                            <button
                              className="text-gray-400 cursor-pointer  hover:text-blue-500 transition"
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(e, task);
                              }}
                            >
                              edit /
                            </button>
                            <button
                              className="text-gray-400 cursor-pointer hover:text-red-500 transition"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                            >
                              delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    //Not finnished all displayed
                    <>
                      <input
                        type="checkbox"
                        checked={task.taskStatus === "CLOSED"}
                        onChange={() => handleToggleComplete(task)}
                      />
                      <div className="text-left overflow-hidden">
                        <h3 className="font-medium truncate">{task.title}</h3>
                        <p className="text-xs text-gray-500 truncate">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {task.dueDate}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {task.taskPriority}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {task.taskStatus}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        <button
                          className="text-gray-400 cursor-pointer  hover:text-blue-500 transition"
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(e, task);
                          }}
                        >
                          edit /
                        </button>
                        <button
                          className="text-gray-400 cursor-pointer hover:text-red-500 transition"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                        >
                          delete
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </ul>
          ))
        )}
      </div>

      {isCreating ? (
        <form onSubmit={handleCreateTask} className="mt-4">
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task name"
            className="w-full p-2 border rounded-md mb-2"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="w-full p-2 border rounded-md mb-2"
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Task dueDate"
            className="w-full p-2 border rounded-md mb-2"
          />
          <label>
            Priority:
            <select
              name="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
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
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <div className="w-4 h-4 mr-1" />
          Add new task
        </button>
      )}
    </div>
  );
}
