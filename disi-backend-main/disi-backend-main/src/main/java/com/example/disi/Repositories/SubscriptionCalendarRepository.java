package com.example.disi.Repositories;

import com.example.disi.Entities.Subscription;
import com.example.disi.Entities.SubscriptionCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionCalendarRepository extends JpaRepository<SubscriptionCalendar,Long> {

//    Subscription findFirstByStartDateAfterAndEndDateBefore()

    List<SubscriptionCalendar> findAllBySubscription(Subscription subscription);
}
