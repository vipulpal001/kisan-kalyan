package com.kisankalyan.security;

import com.kisankalyan.entity.AppUser;
import com.kisankalyan.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AppUserRepository appUserRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findByUsername(username)
                .or(() -> appUserRepository.findByPhoneNumber(username))
                .or(() -> {
                    if ("farmer".equalsIgnoreCase(username) || "ramesh.singh".equalsIgnoreCase(username)) {
                        return appUserRepository.findByUsername("farmer")
                                .or(() -> appUserRepository.findByUsername("ramesh.singh"))
                                .or(() -> appUserRepository.findByPhoneNumber("9876543210"));
                    } else if ("operator".equalsIgnoreCase(username) || "rajesh.verma".equalsIgnoreCase(username) || "suresh.verma".equalsIgnoreCase(username)) {
                        return appUserRepository.findByUsername("operator")
                                .or(() -> appUserRepository.findByUsername("rajesh.verma"))
                                .or(() -> appUserRepository.findByPhoneNumber("9876543211"));
                    } else if ("admin".equalsIgnoreCase(username)) {
                        return appUserRepository.findByUsername("admin")
                                .or(() -> appUserRepository.findByPhoneNumber("9876543212"));
                    }
                    return java.util.Optional.empty();
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + username));

        return new User(
                user.getUsername(),
                user.getPasswordHash(),
                user.getIsActive(),
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
