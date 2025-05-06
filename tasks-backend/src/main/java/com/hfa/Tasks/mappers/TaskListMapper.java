package com.hfa.Tasks.mappers;

import com.hfa.Tasks.domain.dto.TaskListDto;
import com.hfa.Tasks.domain.entities.TaskList;
import org.springframework.stereotype.Component;

public interface TaskListMapper {
    TaskList fromDto(TaskListDto taskListDto);
    TaskListDto toDto(TaskList taskList);
}
