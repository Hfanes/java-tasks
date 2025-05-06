package com.hfa.Tasks.mappers.impl;

import com.hfa.Tasks.domain.dto.TaskListDto;
import com.hfa.Tasks.domain.entities.Task;
import com.hfa.Tasks.domain.entities.TaskList;
import com.hfa.Tasks.domain.entities.TaskStatus;
import com.hfa.Tasks.mappers.TaskListMapper;
import com.hfa.Tasks.mappers.TaskMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TaskListMapperImpl implements TaskListMapper {
    private final TaskMapper taskMapper;
    public TaskListMapperImpl(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    @Override
    public TaskList fromDto(TaskListDto taskListDto) {
        return new TaskList(
                taskListDto.id(),
                taskListDto.title(),
                taskListDto.description(),
                null,
                null,
                Optional.ofNullable(taskListDto.tasks())
                        .map(tasks -> tasks.stream()
                                .map(taskMapper::fromDto)
                                .toList()
                        )
                        .orElse(null)
        );
    }

    @Override
    public TaskListDto toDto(TaskList taskList) {
        return new TaskListDto(
                taskList.getId(),
                taskList.getTitle(),
                taskList.getDescription(),
                Optional.ofNullable(taskList.getTasks())
                        .map(List::size)
                        .orElse(0)
                ,
                calculateTaskListProgress(taskList.getTasks()),
                Optional.ofNullable(taskList.getTasks())
                        .map(tasks -> tasks.stream()
                                .map(taskMapper::toDto)
                                .toList()
                        )
                        .orElse(null)
        );
    }

    private Double calculateTaskListProgress(List<Task> tasks) {
        if(tasks == null || tasks.isEmpty())
        {
            return null;
        }
        long closedTaskCount = tasks.stream().filter(eachTasks -> TaskStatus.CLOSED == eachTasks.getStatus()).count();
        return (double) closedTaskCount / tasks.size();
    }
}
