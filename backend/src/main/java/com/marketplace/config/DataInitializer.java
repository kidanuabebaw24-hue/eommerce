package com.marketplace.config;

import com.marketplace.entity.Category;
import com.marketplace.entity.Role;
import com.marketplace.entity.User;
import com.marketplace.repository.CategoryRepository;
import com.marketplace.repository.RoleRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                new Role(null, "BUYER"),
                new Role(null, "SELLER"),
                new Role(null, "ADMIN")
            ));
            System.out.println("✅ Roles seeded: BUYER, SELLER, ADMIN");
        }

        // Seed Categories
        List<String> requiredCategories = List.of(
            "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", "Car", "Services"
        );
        
        for (String categoryName : requiredCategories) {
            if (categoryRepository.findByName(categoryName).isEmpty()) {
                String description = switch (categoryName) {
                    case "Electronics" -> "Gadgets, devices, and accessories";
                    case "Fashion" -> "Clothing, shoes, and jewelry";
                    case "Home & Garden" -> "Furniture, decor, and tools";
                    case "Sports & Outdoors" -> "Fitness equipment and outdoor gear";
                    case "Car" -> "Vehicles, auto parts, and accessories";
                    case "Services" -> "Professional and local services";
                    default -> "General category";
                };
                categoryRepository.save(new Category(null, categoryName, description));
                System.out.println("✅ Category added: " + categoryName);
            }
        }
        
        if (categoryRepository.count() > 0) {
            System.out.println("✅ Total categories in database: " + categoryRepository.count());
        }

        // Seed Default Admin User
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));
            Role buyerRole = roleRepository.findByName("BUYER")
                .orElseGet(() -> roleRepository.save(new Role(null, "BUYER")));
            Role sellerRole = roleRepository.findByName("SELLER")
                .orElseGet(() -> roleRepository.save(new Role(null, "SELLER")));

            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            adminRoles.add(buyerRole);
            adminRoles.add(sellerRole);

            User adminUser = User.builder()
                .username("admin")
                .fullname("System Administrator")
                .email("admin@marketbridge.com")
                .password(passwordEncoder.encode("admin123"))
                .status(User.UserStatus.ACTIVE)
                .enabled(true)
                .roles(adminRoles)
                .build();

            userRepository.save(adminUser);
            System.out.println("✅ Default Admin created: admin / admin123 (with ADMIN, BUYER, SELLER roles)");
        }
    }
}
