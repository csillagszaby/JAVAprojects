package com.example.disi.DTOs;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RegisterDto {
    private String name;
    private String email;
    private String password;
    private String phone;
}
