package com.example.disi.DTOs.Court;

import lombok.Data;

import java.util.Date;

@Data
public class SearchCourtDto {
    private Date startDate;
    private Long courtId;
}
