package com.marketplace.service;

import com.marketplace.dto.UserProfileRequest;
import com.marketplace.dto.UserProfileResponse;
import com.marketplace.entity.User;
import com.marketplace.entity.UserProfile;
import com.marketplace.repository.UserProfileRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for user profile management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    /**
     * Get current user's profile
     */
    public UserProfileResponse getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createDefaultProfile(user));

        return mapToResponse(profile);
    }

    /**
     * Get profile by user ID
     */
    public UserProfileResponse getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createDefaultProfile(user));

        return mapToResponse(profile);
    }

    /**
     * Update current user's profile
     */
    @Transactional
    public UserProfileResponse updateMyProfile(UserProfileRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createDefaultProfile(user));

        // Update fields
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());
        if (request.getFacebookUrl() != null) profile.setFacebookUrl(request.getFacebookUrl());
        if (request.getTwitterUrl() != null) profile.setTwitterUrl(request.getTwitterUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getBusinessName() != null) profile.setBusinessName(request.getBusinessName());
        if (request.getBusinessRegistration() != null) profile.setBusinessRegistration(request.getBusinessRegistration());

        UserProfile savedProfile = profileRepository.save(profile);
        log.info("Profile updated for user: {}", username);

        return mapToResponse(savedProfile);
    }

    /**
     * Upload profile photo
     */
    @Transactional
    public UserProfileResponse uploadProfilePhoto(MultipartFile file) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createDefaultProfile(user));

        // Store file and get URL
        String fileName = fileStorageService.storeFile(file);
        profile.setProfilePhoto("/uploads/" + fileName);

        UserProfile savedProfile = profileRepository.save(profile);
        log.info("Profile photo uploaded for user: {}", username);

        return mapToResponse(savedProfile);
    }

    /**
     * Get top-rated sellers
     */
    public List<UserProfileResponse> getTopRatedSellers() {
        return profileRepository.findTopRatedSellers().stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get verified sellers with minimum rating
     */
    public List<UserProfileResponse> getVerifiedSellers(Double minRating) {
        return profileRepository.findVerifiedSellersWithMinRating(minRating).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create default profile for new user
     */
    private UserProfile createDefaultProfile(User user) {
        UserProfile profile = UserProfile.builder()
                .user(user)
                .verificationStatus(UserProfile.VerificationStatus.UNVERIFIED)
                .averageRating(0.0)
                .reviewCount(0)
                .build();
        return profileRepository.save(profile);
    }

    /**
     * Map entity to response DTO
     */
    private UserProfileResponse mapToResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .username(profile.getUser().getUsername())
                .fullname(profile.getUser().getFullname())
                .email(profile.getUser().getEmail())
                .profilePhoto(profile.getProfilePhoto())
                .bio(profile.getBio())
                .phone(profile.getPhone())
                .location(profile.getLocation())
                .city(profile.getCity())
                .country(profile.getCountry())
                .verificationStatus(profile.getVerificationStatus().name())
                .verifiedAt(profile.getVerifiedAt())
                .facebookUrl(profile.getFacebookUrl())
                .twitterUrl(profile.getTwitterUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .businessName(profile.getBusinessName())
                .businessRegistration(profile.getBusinessRegistration())
                .averageRating(profile.getAverageRating())
                .reviewCount(profile.getReviewCount())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
