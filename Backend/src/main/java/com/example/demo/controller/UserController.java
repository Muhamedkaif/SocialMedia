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
) throws IOException {

    if (authentication == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    }

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 🧹 delete old image ONLY if exists
    String oldImage = user.getProfileImage();
    if (oldImage != null && !oldImage.isBlank()) {
        cloudinaryService.deleteByUrl(oldImage);
    }

    // ☁ upload new image
    String imageUrl = cloudinaryService.upload(image, "profiles");

    user.setProfileImg(imageUrl);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of(
            "profileImage", imageUrl
    ));
}




}
