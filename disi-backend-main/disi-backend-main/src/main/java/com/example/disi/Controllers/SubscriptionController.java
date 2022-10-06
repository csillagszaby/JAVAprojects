package com.example.disi.Controllers;

import com.example.disi.DTOs.Subscription.AddSubscriptionDto;
import com.example.disi.Entities.Subscription;
import com.example.disi.Services.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping(value = "/addSubscription")
    public ResponseEntity<String > addSubscription(@RequestBody AddSubscriptionDto dto){

        try {
            return ResponseEntity.ok().body(subscriptionService.addSubscription(dto));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return null;
    }

    @GetMapping(value = "/getAllSubscriptions")
    public ResponseEntity<List<Subscription>> getAllSubscriptions(){
        return ResponseEntity.ok().body(subscriptionService.getAllSubscriptions());
    }

    @GetMapping(value = "/getUserSubscriptions/{id}")
    public ResponseEntity<List<Subscription>> getUserSubscriptions(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(subscriptionService.getUserSubscription(id));
    }
}
