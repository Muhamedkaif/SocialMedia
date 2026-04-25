package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.PostService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CloudinaryService;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PostService postService;
    private final CloudinaryService cloudinaryService;

    public UserController(UserService userService , PostService postService , UserRepository userRepository, CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.postService = postService;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/register")
    public UserDto register(@RequestBody CreateUserRequest req) {
        User user = userService.createUser(req);

        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getProfileImage()
        );
    }


    @GetMapping("/me")
    public UserDto getMyProfile(Authentication authentication) {

        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getName(); // 🔐 comes from JWT / session

        User user = userService.findByEmail(email);

        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getProfileImage()
                );
    }

    @GetMapping("/search")
    public List<UserSearchDto> searchUsers(
            @RequestParam("query") String query
    ) {
        return userService.searchUsers(query);
    }

    // 👤 View profile
    @GetMapping("/{username}/profile")
    public UserProfileDto getProfile(
            @PathVariable String username
    ) {
        return userService.getProfile(username);
    }

    @GetMapping("/{username}/posts")
    public List<PostDto> getPostsByUser(@PathVariable String username) {
        return postService.getPostsByUsername(username)
                .stream()
                .map(post ->
                        new PostDto(
                                post.getId(),
                                post.getText(),
                                post.getImageUrl(),
                                post.getUser().getUsername(),
                                post.getCreatedAt()
                        ))
                .toList();
    }
 @PostMapping("/profile-image")
public ResponseEntity<?> uploadProfileImage(
        @RequestParam("image") MultipartFile image,
        Authentication authentication
) {

    try {
        System.out.println("=== PROFILE IMAGE UPLOAD START ===");

        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("AUTH IS NULL");
            return ResponseEntity.status(401).body("Not authenticated");
        }

        if (image == null || image.isEmpty()) {
            System.out.println("IMAGE IS EMPTY");
            return ResponseEntity.badRequest().body("Image is required");
        }

        String email = authentication.getName();
        System.out.println("AUTH USER = " + email);
        System.out.println("IMAGE SIZE = " + image.getSize());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("USER FOUND = " + user.getId());

        if (user.getProfileImage() != null && !user.getProfileImage().isBlank()) {
            System.out.println("DELETING OLD IMAGE");
            cloudinaryService.deleteByUrl(user.getProfileImage());
        }

        System.out.println("UPLOADING NEW IMAGE TO CLOUDINARY");
        String imageUrl = cloudinaryService.upload(image, "profiles");

        System.out.println("CLOUDINARY URL = " + imageUrl);

        user.setProfileImg(imageUrl);
        userRepository.save(user);

        System.out.println("PROFILE IMAGE SAVED");

        return ResponseEntity.ok(Map.of("profileImage", imageUrl));

    } catch (Exception e) {
        System.out.println("🔥 PROFILE IMAGE ERROR 🔥");
        e.printStackTrace(); // THIS LINE IS CRITICAL
        return ResponseEntity.status(500).body(e.getMessage());
    }
}

}
