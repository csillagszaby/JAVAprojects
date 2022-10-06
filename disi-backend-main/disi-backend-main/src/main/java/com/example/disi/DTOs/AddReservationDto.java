package com.example.disi.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddReservationDto {
    private Long createdById;
    private Long courtId;
    private Date startTime;
    private Date endTime;
}
