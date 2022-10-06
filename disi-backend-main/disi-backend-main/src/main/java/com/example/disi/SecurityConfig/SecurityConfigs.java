package com.example.disi.SecurityConfig;

import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import javax.servlet.http.HttpServletResponse;

@RequiredArgsConstructor
@Component
@EnableWebSecurity
public class SecurityConfigs extends WebSecurityConfigurerAdapter {

    private final JwtTokenFilter jwtTokenFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http = http.cors().and()
                .csrf().disable();

        http = http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();

        http = http.exceptionHandling().authenticationEntryPoint(
                (request, response, ex) -> {
                    response.sendError(
                            HttpServletResponse.SC_UNAUTHORIZED,
                            ex.getMessage()
                    );

                }).and();

        // Routes from controller (public routes)
        http.authorizeRequests().antMatchers("/person/login",
                "/person/register","person/resetPassword",
                "person/generateCode","/ws/**","/court/getAvailableCourts","/location/getAllLocations",
                        "/court/getAllCourts","/court/getCourtsForLocation/**","/court/seeCourtAvailability")
                .permitAll().anyRequest().authenticated();
        // Filter
        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

    }
}
