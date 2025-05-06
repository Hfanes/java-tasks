package com.hfa.Tasks.mappers;

import com.hfa.Tasks.domain.dto.TaskDto;
import com.hfa.Tasks.domain.entities.Task;

public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);

}
