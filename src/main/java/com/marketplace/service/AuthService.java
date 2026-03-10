package com.marketplace.service;

import com.marketplace.dto.AuthenticationResponse;
import com.marketplace.dto.LoginRequest;
import com.marketplace.dto.RegistrationRequest;
import com.marketplace.entity.Role;
import com.marketplace.entity.User;
import com.marketplace.repository.RoleRepository;
import com.marketplace.repository.UserRepository;
import com.marketplace.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegistrationRequest request) {
        Set<Role> roles = new HashSet<>();
        
        // Strictly allow only BUYER or SELLER via public registration
        String requestedRole = (request.getRoles() != null && !request.getRoles().isEmpty()) 
            ? request.getRoles().iterator().next().toUpperCase() 
            : "BUYER";

        if (requestedRole.equals("ADMIN")) {
            throw new RuntimeException("Error: ADMIN role cannot be registered manually.");
        }

        Role userRole = roleRepository.findByName(requestedRole)
                .orElseThrow(() -> new RuntimeException("Error: Role " + requestedRole + " is not found."));
        roles.add(userRole);

        var user = User.builder()
                .username(request.getUsername())
                .fullname(request.getFullname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .status(User.UserStatus.ACTIVE) // For demo simplicity, set to ACTIVE (or PENDING if approval needed)
                .enabled(true)
                .build();

        userRepository.save(user);
        
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(roles.stream().map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + r.getName())).toList())
                .build();
        
        var jwtToken = jwtService.generateToken(userDetails);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .roles(roles.stream().map(r -> r.getName()).collect(Collectors.toSet()))
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRoles().stream().map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority(r.getName())).toList())
                .build();

        var jwtToken = jwtService.generateToken(userDetails);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .roles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()))
                .build();
    }
}
