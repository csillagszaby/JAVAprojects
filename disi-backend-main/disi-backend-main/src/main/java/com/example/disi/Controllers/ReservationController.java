package com.example.disi.Controllers;

import com.example.disi.DTOs.AddReservationDto;
import com.example.disi.DTOs.ReservationDto;
import com.example.disi.Entities.Reservation;
import com.example.disi.Services.ReservationService;
import com.example.disi.Utils.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/reservation")
public class ReservationController {



    @Autowired
    private ReservationService reservationService;

    @PostMapping(value = "/addReservation")
    public ResponseEntity<String> addReservation(@RequestBody AddReservationDto addReservationDto){
        if(reservationService.addReservation(addReservationDto)){
            return ResponseEntity.ok().body("Reservation created succesfully");
        }else{
            return ResponseEntity.ok().body("Reservation failed");
        }
    }

    @PostMapping(value = "/successfullyCancel")
    public ResponseEntity<String> cancelSuccessfully(@RequestBody ReservationDto dto){
        return ResponseEntity.ok().body(reservationService.cancelSuccessfully(dto.getId()));
    }

    @PostMapping(value = "/pay")
    public ResponseEntity<String> payReservation(@RequestBody ReservationDto dto){
        return ResponseEntity.ok().body(reservationService.payReservation(dto.getId()));
    }

    @PostMapping(value = "/findTwoPlayers")
    public ResponseEntity<String> findTwoPlayers(@RequestBody ReservationDto dto){
        return ResponseEntity.ok().body(reservationService.findTwoPlayers(dto.getId()));
    }

    @PostMapping(value = "/findOnePlayer")
    public ResponseEntity<String> findOnePlayer(@RequestBody ReservationDto dto){
        if(reservationService.findOnePlayer(dto.getId())){
            //template.convertAndSend("/reservation/notification",new Notification("Un teren disponibil"));
            //sendNotification(new Notification("Someone is looking for a partner!"));
            return ResponseEntity.ok().body("Player found");
        }else{
            return ResponseEntity.ok().body("Player finding failed");
        }
    }

    @GetMapping(value = "/getReservationsHavingFindingStatus")
    public ResponseEntity<List<Reservation>> getReservationsHavingFindingStatus(){
        return ResponseEntity.ok().body(reservationService.getReservationsHavingFindingStatus());
    }

    @GetMapping(value = "/getAllReservations")
    public ResponseEntity<List<Reservation>> getAllReservations(){
        return ResponseEntity.ok().body(reservationService.getAllReservations());
    }

    @GetMapping(value = "/getUserReservations/{id}")
    public ResponseEntity<List<Reservation>> getUserReservations(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(reservationService.getUserReservations(id));
    }

    @SendTo("/notification")
    public Notification sendNotification(@Payload Notification notification){
        return notification;
    }
}
