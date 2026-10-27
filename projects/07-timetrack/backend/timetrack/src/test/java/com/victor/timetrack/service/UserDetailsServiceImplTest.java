package com.victor.timetrack.service;

import com.victor.timetrack.model.Role;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsername_returnsTheUserWithItsHashAndRole() {
        User user = new User();
        user.setEmail("ana@timetrack.com");
        user.setPassword("$2a$10$storedHash");
        user.setRole(Role.EMPLOYEE);

        when(userRepository.findByEmail("ana@timetrack.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("ana@timetrack.com");

        assertThat(details.getUsername()).isEqualTo("ana@timetrack.com");
        assertThat(details.getPassword()).isEqualTo("$2a$10$storedHash");
        assertThat(details.getAuthorities()).extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_EMPLOYEE");
    }

    @Test
    void loadUserByUsername_throwsWhenTheEmailIsUnknown(){
        when(userRepository.findByEmail("nobody@timetrack.com")).thenReturn(Optional.empty());

        assertThatThrownBy(()->userDetailsService.loadUserByUsername("nobody@timetrack.com")).isInstanceOf(
                UsernameNotFoundException.class);


    }

    @Test
    void loadUserByUsername_mapsAnInactiveUserAsDisabled(){
        User user = new User();
        user.setEmail("ana@timetrack.com");
        user.setPassword("$2a$10$storedHash");
        user.setActive(false);
        user.setRole(Role.EMPLOYEE);

        when(userRepository.findByEmail("ana@timetrack.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("ana@timetrack.com");

        assertThat(details.isEnabled()).isFalse();
    }

    @Test
    void loadUserByUsername_findsTheUserWhateverTheEmailCase(){
        User user = new User();
        user.setEmail("ana@timetrack.com");
        user.setPassword("$2a$10$storedHash");
        user.setRole(Role.EMPLOYEE);

        when(userRepository.findByEmail("ana@timetrack.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("Ana@TimeTrack.Com");

        assertThat(details.getUsername()).isEqualTo("ana@timetrack.com");
    }

    @Test
    void loadUserById_returnsTheUserForAKnownId(){
        User user = new User();
        user.setEmail("ana@timetrack.com");
        user.setPassword("$2a$10$storedHash");
        user.setRole(Role.EMPLOYEE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserById(1L);

        assertThat(details.getUsername()).isEqualTo("ana@timetrack.com");
    }

    @Test
    void loadUserById_throwsWhenTheIdIsUnknown(){
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(()->userDetailsService.loadUserById(99L)).isInstanceOf(UsernameNotFoundException.class);
    }
}
