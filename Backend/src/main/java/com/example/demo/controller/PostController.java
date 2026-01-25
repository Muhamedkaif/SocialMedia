package com.example.demo.controller;
import com.example.demo.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.example.demo.dto.PostDto;
import com.example.demo.entity.Post;
import com.example.demo.service.PostService;
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
    private final FileService fileService;

    public PostController(PostService postService, FileService fileService) {
        this.postService = postService;
        this.fileService = fileService;
    }@PostMapping(
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

        System.out.println("AUTH = " + authentication);

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileService.savePostImage(image);
        }

        Post post = postService.createPost(email, text, imageUrl);

        return PostDto.from(post);
    }



    @GetMapping("/getAll")
    public List<PostDto> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        System.out.println("POST COUNT = " + posts.size());

        return posts.stream()
                .map(PostDto::from)
                .toList();
    }


    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            Authentication authentication
    ) throws AccessDeniedException {
        String email = authentication.getName(); // logged-in user email

        postService.deletePost(postId, email);

        return ResponseEntity.ok(
                Map.of("message", "Post deleted successfully")
        );
    }


}
