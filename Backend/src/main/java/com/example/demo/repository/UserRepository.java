package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameIgnoreCase(String username);

    // ✅ MUST return List
    List<User> findByUsernameContainingIgnoreCase(String query);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}


