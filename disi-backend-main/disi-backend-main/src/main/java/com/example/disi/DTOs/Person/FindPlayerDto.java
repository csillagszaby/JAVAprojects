package com.example.disi.DTOs.Person;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FindPlayerDto {
    private Long reservationId;
    private Long userId;
}
