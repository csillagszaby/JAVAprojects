package com.example.disi.DTOs;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocationDto {

    private Long id;
    private String details;
}
