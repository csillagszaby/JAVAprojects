package com.example.disi.Entities;

import com.example.disi.Utils.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date startTime;

    private Date endTime;

    private Integer price;

    @ManyToOne
    private Court court;

    private Status status;

    @OneToOne
    Person createdBy;

    @OneToOne
    Person player1;

    @OneToOne
    Person player2;
}
