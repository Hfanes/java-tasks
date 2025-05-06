package com.hfa.Tasks.domain.dto;

public record ErrorResponse(
        int status,
        String message,
        String details
) {
}
