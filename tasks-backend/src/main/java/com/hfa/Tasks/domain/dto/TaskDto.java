package com.hfa.Tasks.domain.dto;

import com.hfa.Tasks.domain.entities.TaskPriority;
import com.hfa.Tasks.domain.entities.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;


//Using record we have all constructors, tostring, etc done automatically
//This is immutable, so we only have getters
public record TaskDto(UUID id,
                      String title,
                      String description,
                      LocalDateTime dueDate,
                      TaskPriority taskPriority,
                      TaskStatus taskStatus
) {
}
