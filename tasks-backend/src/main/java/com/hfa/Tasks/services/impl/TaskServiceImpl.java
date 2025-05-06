package com.hfa.Tasks.services.impl;

import com.hfa.Tasks.domain.entities.Task;
import com.hfa.Tasks.domain.entities.TaskList;
import com.hfa.Tasks.domain.entities.TaskPriority;
import com.hfa.Tasks.domain.entities.TaskStatus;
import com.hfa.Tasks.mappers.TaskMapper;
import com.hfa.Tasks.repositories.TaskListRepository;
import com.hfa.Tasks.repositories.TaskRepository;
import com.hfa.Tasks.services.TaskService;
import jakarta.transaction.TransactionScoped;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;
    private final TaskMapper taskMapper;
    public TaskServiceImpl(TaskRepository taskRepository, TaskListRepository taskListRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public List<Task> listTasks(UUID taskListId) {
        return taskRepository.findByTaskListId(taskListId);
    }

    @Transactional
    @Override
    public Task createTask(UUID taskListId, Task task) {
        if(task.getId() != null)
        {
            throw new IllegalArgumentException("Task already has an ID");
        }
        if(task.getTitle() == null || task.getTitle().isEmpty())
        {
            throw new IllegalArgumentException("Task title is empty");
        }
        TaskPriority taskPriority = Optional.ofNullable(task.getPriority()).orElse(TaskPriority.MEDIUM);
        TaskStatus taskStatus = TaskStatus.OPEN;
        TaskList taskList =  taskListRepository.findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("TaskList does not exist"));
        LocalDateTime now = LocalDateTime.now();
        Task taskToSave = new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                taskStatus,
                taskPriority,
                taskList,
                now,
                now
        );
        return taskRepository.save(taskToSave);

    }

    @Override
    public Optional<Task> getTask(UUID taskListId, UUID taskId) {
        return taskRepository.findByTaskListIdAndId(taskListId, taskId);
    }

    @Transactional
    @Override
    public Task updateTask(UUID taskListId, UUID taskId, Task task) {
        if(task.getId() == null)
        {
            throw new IllegalArgumentException("Task does not have an ID");
        }
        if (!taskId.equals(task.getId()))
        {
            throw new IllegalArgumentException("Attempting to change task id, this is not permitted");
        }
        if(task.getPriority() == null || task.getStatus() == null)
        {
            throw new IllegalArgumentException("Task priority or status is empty");
        }
        Task taskToupdate = taskRepository.findByTaskListIdAndId(taskListId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task does not exist"));

        taskToupdate.setTitle(task.getTitle());
        taskToupdate.setDescription(task.getDescription());
        taskToupdate.setDueDate(task.getDueDate());
        taskToupdate.setStatus(task.getStatus());
        taskToupdate.setPriority(task.getPriority());
        taskToupdate.setUpdated(LocalDateTime.now());

        return taskRepository.save(taskToupdate);
    }

    @Transactional
    @Override
    public void deleteTask(UUID taskListId, UUID taskId) {
        taskRepository.deleteByTaskListIdAndId(taskListId, taskId);
    }
}
