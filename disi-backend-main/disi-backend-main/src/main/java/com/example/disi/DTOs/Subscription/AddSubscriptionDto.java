package com.example.disi.DTOs.Subscription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddSubscriptionDto {

    private Long createdById;
    private Long courtId;
    private String month;
    private String startHour;
    private String endHour;
}
