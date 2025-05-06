package com.hfa.Tasks.services.impl;


import com.hfa.Tasks.domain.entities.TaskList;
import com.hfa.Tasks.repositories.TaskListRepository;
import com.hfa.Tasks.services.TaskListService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskListServiceImpl implements TaskListService {
    private final TaskListRepository taskListRepository;
    public TaskListServiceImpl(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    @Override
    public List<TaskList> listTaskLists() {
        return taskListRepository.findAll();
    }

    @Transactional
    @Override
    public TaskList createTaskList(TaskList taskList) {
        //Only when created it will receive an id
        if(taskList.getId() != null)
        {
            throw new IllegalArgumentException("TaskList already has an ID");
        }
        if(taskList.getTitle() == null || taskList.getTitle().isBlank())
        {
            throw new IllegalArgumentException("TaskList title is blank");
        }
        LocalDateTime now = LocalDateTime.now();
        //Same as
        /*
            taskList.setCreated(now);
            taskList.setUpdated(now);
            return taskListRepository.save(taskList);
         */
        return taskListRepository.save(new TaskList(
                null, taskList.getTitle(),taskList.getDescription(), now, now, null
        ));
    }

    @Override
    public Optional<TaskList> getTaskList(UUID id) {
        return taskListRepository.findById(id);
    }

    @Transactional
    @Override
    public TaskList updateTaskList(UUID id, TaskList taskList) {
        if(taskList.getId() == null)
        {
            throw new IllegalArgumentException("TaskList does not have an ID");
        }
        if(!id.equals(taskList.getId()))
        {
            throw new IllegalArgumentException("Attempting to change task list id, this is not permitted");
        }
        TaskList existingTaskList = taskListRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task list not found"));
        existingTaskList.setTitle(taskList.getTitle());
        existingTaskList.setDescription(taskList.getDescription());
        existingTaskList.setUpdated(LocalDateTime.now());
        return taskListRepository.save(existingTaskList);
    }

    @Override
    public void deleteTaskList(UUID id) {
        taskListRepository.deleteById(id);
    }
}

