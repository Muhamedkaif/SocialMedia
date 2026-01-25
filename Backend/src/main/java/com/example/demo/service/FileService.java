package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    private static final String BASE_DIR = "uploads/";
    private final Path root = Paths.get("uploads");

    // 🔹 Existing method (UNCHANGED behavior)
    public String savePostImage(MultipartFile file) throws IOException {
        return saveFile(file, "posts");
    }

    // ⭐ NEW method for profile image
    public String saveProfileImage(MultipartFile file) throws IOException {
        return saveFile(file, "profiles");
    }

    // 🔹 Common reusable logic
    private String saveFile(MultipartFile file, String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(BASE_DIR + folder + "/" + fileName);

        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        // returned path stored in DB
        return "/uploads/" + folder + "/" + fileName;
    }
    public void deleteProfileImage(String imagePath) {

        if (imagePath == null || imagePath.isBlank()) return;

        // Safety: only delete profile images
        if (!imagePath.startsWith("/uploads/profiles/")) return;

        try {
            // Remove leading "/" and resolve relative to project root
            Path filePath = Paths.get(imagePath.substring(1)).toAbsolutePath();

            System.out.println("Deleting file: " + filePath);

            Files.deleteIfExists(filePath);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void delete(String filePath) {
        if (filePath == null || filePath.isBlank()) return;

        try {
            // Remove "/uploads/" from DB path
            String relativePath = filePath.replace("/uploads/", "");

            Path file = root.resolve(relativePath).normalize();

            Files.deleteIfExists(file);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + filePath);
        }
    }

}
