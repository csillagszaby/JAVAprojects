package com.example.disi.Services;

import com.example.disi.DTOs.SubscriptionCalendarDto;
import com.example.disi.Entities.Subscription;
import com.example.disi.Entities.SubscriptionCalendar;
import com.example.disi.Repositories.SubscriptionCalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubscriptionCalendarService {

    @Autowired
    private SubscriptionCalendarRepository subscriptionCalendarRepository;

    public List<SubscriptionCalendarDto> findAll(){
        List<SubscriptionCalendar> sc = subscriptionCalendarRepository.findAll();
        List<SubscriptionCalendarDto> dtoList = new ArrayList<>();
        for(SubscriptionCalendar s: sc){
            SubscriptionCalendarDto sdto = SubscriptionCalendarDto.builder()
                    .id(s.getId())
                    .startDate(s.getStartDate())
                    .endDate(s.getEndDate())
                    .subscription(s.getSubscription())
                    .build();
            dtoList.add(sdto);
        }
        return dtoList;
    }

    List<SubscriptionCalendar> getSubscriptionCalendarForSubscription(Subscription subscription){
        return subscriptionCalendarRepository.findAllBySubscription(subscription);
    }
}
