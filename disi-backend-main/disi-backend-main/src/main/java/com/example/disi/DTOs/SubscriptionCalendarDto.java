package com.example.disi.DTOs;

import com.example.disi.Entities.Subscription;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionCalendarDto {
    private Long id;
    private Date startDate;
    private Date endDate;
    private Subscription subscription;
}
