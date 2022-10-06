package com.example.disi.SecurityConfig;

import com.example.disi.DTOs.PersonDto;
import com.example.disi.Entities.Person;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    private static final String singInKey = "verysecuresignaturekey";
    private static final int accessTokenValiditySeconds = 30 * 60;

    public String getUsernameFromToken(String token) {

        return getClaimFromToken(token, Claims::getSubject);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {

        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {

        return Jwts.parser().setSigningKey(singInKey).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {

        final Date expireDate = getExpirationDateFromToken(token);
        return expireDate.before(new Date());
    }

    private Date getExpirationDateFromToken(String token) {

        return getClaimFromToken(token, Claims::getExpiration);
    }

    public String generateToken(PersonDto person) {
        return doGenerateToken(person.getEmail());
    }

    private String doGenerateToken(String username) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("scopes", Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        return Jwts.builder().setClaims(claims).setIssuer("http://devglan.com").setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValiditySeconds * 1000)).signWith(SignatureAlgorithm.HS256, singInKey).compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
}
