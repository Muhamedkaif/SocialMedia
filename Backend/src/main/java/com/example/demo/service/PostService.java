package com.example.demo.service;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepo;
    private final UserRepository userRepo;
    private final CloudinaryService cloudinaryService;

    public PostService(
            PostRepository postRepo,
            UserRepository userRepo,
            CloudinaryService cloudinaryService
    ) {
        this.postRepo = postRepo;
        this.userRepo = userRepo;
        this.cloudinaryService = cloudinaryService;
    }

    // ➕ Create post
    public Post createPost(String email, String text, String imageUrl) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setText(text);
        post.setImageUrl(imageUrl);

        return postRepo.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUsername(String username) {
        return postRepo.findByUserUsernameOrderByCreatedAtDesc(username);
    }

    // 🗑️ Delete post + image
    public void deletePost(Long postId, String email)
            throws AccessDeniedException, IOException {

        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not allowed to delete this post");
        }

        // ☁ delete image from Cloudinary
        cloudinaryService.deleteByUrl(post.getImageUrl());

        postRepo.delete(post);
    }
}
