package com.example.demo.service;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepo;
    private final UserRepository userRepo;
    private final FileService fileService;
    public PostService(PostRepository postRepo, UserRepository userRepo, FileService fileService) {
        this.postRepo = postRepo;
        this.userRepo = userRepo;
        this.fileService = fileService;
    }

    public Post createPost(String email , String text , String imageUrl ) {

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
    public void deletePost(Long postId, String email) throws AccessDeniedException {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // ✅ Owner check
        if (!post.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not allowed to delete this post");
        }

        // ✅ Delete image from disk (if exists)
        if (post.getImageUrl() != null) {
            fileService.delete(post.getImageUrl());
        }

        postRepo.delete(post);
    }
}
