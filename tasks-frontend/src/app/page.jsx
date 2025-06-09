"use client";
import React, { use, useEffect, useState } from "react";
import TaskLists from "@/components/TaskLists";
import Tasks from "@/components/Tasks";
import TaskAI from "@/components/TaskAI";

export default function Home() {
  const [taskLists, setTaskLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  useEffect(() => {
    fetchTasksLists();
  }, []);

  useEffect(() => {
    if (selectedTaskList) {
      console.log("fetching tasks");
      console.log("id", selectedTaskList.id);
      const fetchTasks = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/task-lists/${selectedTaskList.id}/tasks`
          );
          const data = await response.json();
          console.log("tasks", data);
          setTasks(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchTasks();
    }
  }, [selectedTaskList]);

  const handleTaskListClick = (taskList) => {
    console.log("clicktasks lists", taskList);

    setSelectedTaskList(taskList);
  };

  const fetchTasksLists = async () => {
    try {
      const response = await fetch("http://localhost:8080/task-lists");
      const data = await response.json();
      setTaskLists(data);
    } catch (error) {
      console.log("Error fetching taskslist", error);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50 text-black">
      <TaskLists
        onTaskListClick={handleTaskListClick}
        selectedTaskList={selectedTaskList}
        setTaskLists={setTaskLists}
        taskLists={taskLists}
      />
      {selectedTaskList ? (
        <Tasks
          selectedTaskList={selectedTaskList}
          tasks={tasks}
          setTasks={setTasks}
        />
      ) : (
        <p className="flex-grow p-8 flex items-center justify-center text-gray-500">
          Please select a task list to view its tasks
        </p>
      )}
    </main>
  );
}
