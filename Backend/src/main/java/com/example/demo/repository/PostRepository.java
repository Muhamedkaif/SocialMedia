package com.example.demo.repository;

import com.example.demo.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findById(Long id);
    List<Post> findByUserUsernameOrderByCreatedAtDesc(String username);
    List<Post> findAllByOrderByCreatedAtDesc();
}

