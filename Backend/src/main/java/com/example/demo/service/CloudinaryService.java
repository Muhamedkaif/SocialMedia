package com.example.demo.service;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // 📤 Upload image
    public String upload(MultipartFile file, String folder) throws IOException {
        Map result = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of("folder", folder)
        );
        return result.get("secure_url").toString();
    }

    // 🗑️ Delete image using URL
    public void deleteByUrl(String imageUrl) {
    try {
        if (imageUrl == null || imageUrl.isBlank()) return;
        if (!imageUrl.contains("/upload/")) return;

        String publicId = imageUrl
                .substring(imageUrl.indexOf("/upload/") + 8)
                .replaceAll("\\.[^.]+$", "");

        cloudinary.uploader().destroy(publicId, Map.of());
    } catch (Exception e) {
        e.printStackTrace(); // log but never crash request
    }
}

}
