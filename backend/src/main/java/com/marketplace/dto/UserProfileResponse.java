package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for user profile response
 */
@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private Long userId;
    private String username;
    private String fullname;
    private String email;
    private String profilePhoto;
    private String bio;
    private String phone;
    private String location;
    private String city;
    private String country;
    private String verificationStatus;
    private LocalDateTime verifiedAt;
    private String facebookUrl;
    private String twitterUrl;
    private String linkedinUrl;
    private String businessName;
    private String businessRegistration;
    private Double averageRating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
