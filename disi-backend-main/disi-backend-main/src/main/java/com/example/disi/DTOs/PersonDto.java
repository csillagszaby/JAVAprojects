package com.example.disi.DTOs;

import com.example.disi.Entities.Reservation;
import com.example.disi.Entities.Subscription;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonDto {

    private Long id;
    private String username;
    private String name;
    private String email;
    private String phone;
    private Boolean isAdmin;
    private List<Subscription> subscriptions;
    private List<Reservation> rezervations;
}
