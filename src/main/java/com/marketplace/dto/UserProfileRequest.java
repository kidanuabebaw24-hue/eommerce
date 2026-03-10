package com.marketplace.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for updating user profile
 */
@Data
public class UserProfileRequest {

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;

    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Size(max = 100, message = "Country cannot exceed 100 characters")
    private String country;

    @Size(max = 255, message = "Facebook URL cannot exceed 255 characters")
    private String facebookUrl;

    @Size(max = 255, message = "Twitter URL cannot exceed 255 characters")
    private String twitterUrl;

    @Size(max = 255, message = "LinkedIn URL cannot exceed 255 characters")
    private String linkedinUrl;

    @Size(max = 255, message = "Business name cannot exceed 255 characters")
    private String businessName;

    @Size(max = 255, message = "Business registration cannot exceed 255 characters")
    private String businessRegistration;
}
