package com.hfa.Tasks.controllers;

import com.hfa.Tasks.domain.dto.TaskDto;
import com.hfa.Tasks.domain.entities.Task;
import com.hfa.Tasks.mappers.TaskMapper;
import com.hfa.Tasks.services.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.core.annotations.RouterOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path ="/task-lists/{task_list_id}/tasks")
@CrossOrigin(origins = "http://localhost:3000/")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @GetMapping
    public List<TaskDto> listTasks(@PathVariable("task_list_id") UUID taskListId)
    {
        return taskService.listTasks(taskListId)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @PostMapping
    public TaskDto createTask(@PathVariable("task_list_id") UUID taskListId, @RequestBody TaskDto taskDto) {
        Task task = taskService.createTask(taskListId, taskMapper.fromDto(taskDto));
        return taskMapper.toDto(task);
    }

    @Operation(
            summary = "Small description",
            description = "Large description",
            operationId = "operationId",
            tags = { "taskSwagger" },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful",
                            content = @Content(schema = @Schema(implementation = TaskDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Not Found",
                            content = @Content(schema = @Schema(implementation = TaskDto.class))
                    )
            }
    )
    @GetMapping("/{taskId}")
    public Optional<TaskDto> getTaskById(@PathVariable("task_list_id") UUID taskListId, @PathVariable("taskId") UUID taskId) {
        Optional<Task> task = taskService.getTask(taskListId, taskId);
        return task.map(taskMapper::toDto);
    }

    @PutMapping(path ="/{taskId}")
    public TaskDto updateTask(@PathVariable("task_list_id") UUID taskListId, @PathVariable("taskId") UUID taskId, @RequestBody TaskDto taskDto) {
        Task task = taskService.updateTask(taskListId, taskId, taskMapper.fromDto(taskDto));
        return taskMapper.toDto(task);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable("task_list_id") UUID taskListId, @PathVariable("taskId") UUID taskId) {
        taskService.deleteTask(taskListId, taskId);
    }


}
