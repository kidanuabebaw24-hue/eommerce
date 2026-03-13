package com.marketplace.controller;

import com.marketplace.dto.UserProfileRequest;
import com.marketplace.dto.UserProfileResponse;
import com.marketplace.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for user profiles
 */
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService profileService;

    /**
     * Get my profile
     * GET /api/v1/profile
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    /**
     * Get profile by user ID
     * GET /api/v1/profile/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    /**
     * Update my profile
     * PUT /api/v1/profile
     */
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> updateMyProfile(@Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(profileService.updateMyProfile(request));
    }

    /**
     * Upload profile photo
     * POST /api/v1/profile/photo
     */
    @PostMapping("/photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(profileService.uploadProfilePhoto(file));
    }

    /**
     * Get top-rated sellers
     * GET /api/v1/profile/top-sellers
     */
    @GetMapping("/top-sellers")
    public ResponseEntity<List<UserProfileResponse>> getTopRatedSellers() {
        return ResponseEntity.ok(profileService.getTopRatedSellers());
    }

    /**
     * Get verified sellers with minimum rating
     * GET /api/v1/profile/verified-sellers?minRating=4.0
     */
    @GetMapping("/verified-sellers")
    public ResponseEntity<List<UserProfileResponse>> getVerifiedSellers(
            @RequestParam(defaultValue = "4.0") Double minRating) {
        return ResponseEntity.ok(profileService.getVerifiedSellers(minRating));
    }
}
