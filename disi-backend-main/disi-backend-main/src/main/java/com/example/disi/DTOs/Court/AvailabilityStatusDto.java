package com.example.disi.DTOs.Court;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AvailabilityStatusDto {

    private String hour;
    private Boolean status;
}
