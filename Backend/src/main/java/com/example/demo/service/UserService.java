package com.example.demo.service;
import java.util.List;
import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.UserProfileDto;
import com.example.demo.dto.UserSearchDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest req) {

        if (userRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("username already exists");
        }

        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("email already exists");
        }

        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setDisplayName(req.displayName());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        return userRepository.save(user);
    }



    public List<UserSearchDto> searchUsers(String query) {
        return userRepository
                .findByUsernameContainingIgnoreCase(query)
                .stream()
                .map(user -> new UserSearchDto(
                        user.getId(),
                        user.getUsername(),
                        user.getDisplayName()
                ))
                .toList();
    }

    public UserProfileDto getProfile(String username) {

        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileDto(
                user.getUsername(),
                user.getDisplayName(),
                user.getBio(),
                user.getPosts().size() ,
                user.getProfileImage()
        );
    }



    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }



}
