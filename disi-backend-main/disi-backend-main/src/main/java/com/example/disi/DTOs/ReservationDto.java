package com.example.disi.DTOs;

import com.example.disi.Entities.Court;
import com.example.disi.Entities.Person;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {

    private Long id;
    private Date startTime;
    private Date endTime;
    private Integer price;
    private Court court;
    Person player1;
    Person player2;
}
