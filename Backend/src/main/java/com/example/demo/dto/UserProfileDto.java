package com.example.demo.dto;

public record UserProfileDto(
        String username,
        String displayName,
        String bio,
        int postsCount ,
        String profileImage
) {}
