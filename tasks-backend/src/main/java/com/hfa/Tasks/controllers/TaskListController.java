package com.hfa.Tasks.controllers;

import com.hfa.Tasks.domain.dto.TaskListDto;
import com.hfa.Tasks.domain.entities.TaskList;
import com.hfa.Tasks.mappers.TaskListMapper;
import com.hfa.Tasks.services.TaskListService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/task-lists")
@CrossOrigin(origins = "http://localhost:3000/")
public class TaskListController {
    private final TaskListService taskListService;
    private final TaskListMapper taskListMapper;
    public TaskListController(TaskListService taskListService, TaskListMapper taskListMapper) {
        this.taskListService = taskListService;
        this.taskListMapper = taskListMapper;
    }

    @GetMapping
    public List<TaskListDto> listTaskLists()
    {
        return taskListService.listTaskLists()
                .stream()
                .map(taskListMapper::toDto)
                .toList();
    }

    @PostMapping
    public TaskListDto createTaskList(@RequestBody TaskListDto taskListDto) {
        //createTaskList needs a TaskList, so we convert taskListDto to TaskList, we set id, created, updated to null and we set title & description
        //then in service we verify if id is null, and if title is not empty
        //then we save to db the taskList with id null, title from taskListDto, description from taskListDto, created & updated calculated in service & task to null
        //then we need to convert again to dto because we want to return only the variables that we want
        //toDto gets de id (created from db), title, description, count if any, progress, task if any
        TaskList taskListCreated =  taskListService.createTaskList(taskListMapper.fromDto(taskListDto));
        //return taskListDto;
        //we convert again to dto
        return taskListMapper.toDto(taskListCreated);
    }

    @GetMapping("/{taskListId}")
    public Optional<TaskListDto> getTaskList(@PathVariable UUID taskListId) {
        Optional<TaskList> taskList = taskListService.getTaskList(taskListId);
        //since we have an optional we cant do
        //return taskListMapper.toDto(task);
        // map() will only apply to the value if it is present
        return taskList.map(taskListMapper::toDto);
    }

    @PostMapping("/{taskListId}")
    public TaskListDto updateTaskList(@PathVariable UUID taskListId, @RequestBody TaskListDto taskListDto) {
        TaskList updatedTaskList = taskListService.updateTaskList(taskListId, taskListMapper.fromDto(taskListDto));
        return taskListMapper.toDto(updatedTaskList);
    }

    @DeleteMapping("/{taskListId}")
    public void deleteTaskList(@PathVariable UUID taskListId) {
        taskListService.deleteTaskList(taskListId);
    }
}
