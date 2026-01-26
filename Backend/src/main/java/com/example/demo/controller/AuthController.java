package com.example.demo.controller;

import com.example.demo.dto.LoginDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
public Map<String, String> login(
        @RequestBody LoginDto request,
        HttpServletRequest httpRequest
) {
    Authentication authentication =
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email().toLowerCase(),
                            request.password()
                    )
            );

    // 🔐 Create a new SecurityContext
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);

    // 🔐 Set it for current thread
    SecurityContextHolder.setContext(context);

    // 🔥 SAVE CONTEXT IN SESSION (THIS WAS MISSING)
    HttpSession session = httpRequest.getSession(true);
    session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            context
    );

    return Map.of("message", "Login successful");
}


}
