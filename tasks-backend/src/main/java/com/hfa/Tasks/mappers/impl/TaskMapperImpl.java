package com.hfa.Tasks.mappers.impl;

import com.hfa.Tasks.domain.dto.TaskDto;
import com.hfa.Tasks.domain.entities.Task;
import com.hfa.Tasks.mappers.TaskMapper;
import org.springframework.stereotype.Component;

@Component
public class TaskMapperImpl implements TaskMapper {

    @Override
    public Task fromDto(TaskDto taskDto) {
        return new Task(
                taskDto.id(),
                taskDto.title(),
                taskDto.description(),
                taskDto.dueDate(),
                taskDto.taskStatus(),
                taskDto.taskPriority(),
                null,
                null,
                null
        );
    }
    @Override
    public TaskDto toDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus()
        );
    }
}
