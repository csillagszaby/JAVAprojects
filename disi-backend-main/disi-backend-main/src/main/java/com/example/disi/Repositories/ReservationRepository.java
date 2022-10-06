package com.example.disi.Repositories;

import com.example.disi.Entities.Court;
import com.example.disi.Entities.Person;
import com.example.disi.Entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {

    Reservation findFirstByCourt(Court court);
    Reservation findFirstByCourt_Id(Long id);
    List<Reservation> findAll();
    Reservation findFirstById(Long idReservation);
    List<Reservation> findAllByCreatedBy(Person person);
    List<Reservation> findAllByPlayer1(Person person);
    List<Reservation> findAllByPlayer2(Person person);
    List<Reservation> findAllByCourt(Court court);
}
