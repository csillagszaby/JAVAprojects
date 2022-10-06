package com.example.disi.SecurityConfig;

import com.example.disi.Repositories.PersonRepository;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.springframework.http.HttpHeaders;
import static org.apache.logging.log4j.util.Strings.isEmpty;

@Component
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final PersonRepository personRepository;

    public JwtTokenFilter(JwtTokenUtil jwtTokenUtil, PersonRepository personRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.personRepository = personRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (isEmpty(header) || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        // ok
        String token = header.split(" ")[1].trim();
        UserDetails userDetails = null;
        try {
            userDetails = personRepository.findByEmail(jwtTokenUtil.getUsernameFromToken(token)).orElse(null);

        } catch (ExpiredJwtException exception) {
            System.out.println(exception.getMessage());
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }
        // User not found
        if (userDetails == null) {
            filterChain.doFilter(request, response);
            return;
        }
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("Succes auth");
        filterChain.doFilter(request, response);
    }
}
