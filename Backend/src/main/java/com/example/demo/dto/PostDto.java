package com.example.demo.dto;

import com.example.demo.entity.Post;

import java.time.LocalDateTime;

public class PostDto {

    private Long id;
    private String text;
    private String imageUrl;
    private String username;
    private LocalDateTime createdAt;

    // constructor
    public PostDto(Long id, String text, String imageUrl, String username, LocalDateTime createdAt) {
        this.id = id;
        this.text = text;
        this.imageUrl = imageUrl;
        this.username= username;
        this.createdAt = createdAt;
    }


    public static PostDto from(Post post) {
        return new PostDto(
                post.getId(),
                post.getText(),
                post.getImageUrl(),
                post.getUser().getUsername(),
                post.getCreatedAt()
        );
    }
    public Long getId() { return id; }
    public String getText() { return text; }
    public String getImageUrl() { return imageUrl; }
    public String getUsername() { return username; }

    public void setId(Long id) { this.id = id; }
    public void setText(String text) { this.text = text; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setUsername(Long userId) { this.username = username; }
    // getters & setters
}
