package com.example.demo.controller;

import com.example.demo.dto.PostDto;
import com.example.demo.entity.Post;
import com.example.demo.service.CloudinaryService;
import com.example.demo.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CloudinaryService cloudinaryService;

    public PostController(PostService postService, CloudinaryService cloudinaryService) {
        this.postService = postService;
        this.cloudinaryService = cloudinaryService;
    }

    // ✅ CREATE POST (with optional image)
    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public PostDto createPost(
            @RequestParam("text") String text,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication
    ) throws IOException {

        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getName();

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.upload(image, "posts");
        }

        Post post = postService.createPost(email, text, imageUrl);
        return PostDto.from(post);
    }

    // ✅ GET ALL POSTS
    @GetMapping("/getAll")
    public List<PostDto> getAllPosts() {
        return postService.getAllPosts()
                .stream()
                .map(PostDto::from)
                .toList();
    }

    // ✅ DELETE POST + IMAGE FROM CLOUDINARY
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            Authentication authentication
    ) throws AccessDeniedException, IOException {

        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getName();
        postService.deletePost(postId, email);

        return ResponseEntity.ok(
                Map.of("message", "Post deleted successfully")
        );
    }
}
