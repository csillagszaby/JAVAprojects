package com.example.disi.DTOs;

import com.example.disi.Entities.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourtDto {
    private Long id;
    private Integer number;
    private Location location;
}
