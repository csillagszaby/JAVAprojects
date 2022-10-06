package com.example.disi.Repositories;

import com.example.disi.Entities.Court;
import com.example.disi.Entities.Person;
import com.example.disi.Entities.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {

//    Subscription findFirstByCourtAndMonthAndD
    Subscription findFirstByCourt_IdAndMonthAndStartHourAndEndHour(Long courtId,String month,String startHour,String endHour);

    // Find all subscriptions for a court for a specific month
    List<Subscription> findAllByCourt_IdAndMonth(Long idCourt,String month);

    List<Subscription> findAllByCreatedBy(Person person);

    List<Subscription> findAllByCourt(Court court);
}
