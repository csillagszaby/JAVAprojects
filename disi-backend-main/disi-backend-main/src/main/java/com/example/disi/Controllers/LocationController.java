package com.example.disi.Controllers;

import com.example.disi.DTOs.LocationDto;
import com.example.disi.Services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(exposedHeaders = "authorization")
@RequestMapping(value = "/location")
public class LocationController {

    @Autowired
    LocationService locationService;

    @GetMapping(value = "/getAllLocations")
    public ResponseEntity<List<LocationDto>> getAll(){
        return ResponseEntity.status(HttpStatus.OK).body(locationService.getAllLocations());
    }

    @PostMapping(value = "/addLocation")
    public ResponseEntity<String> addLocation(@RequestBody LocationDto locationDto){
        Boolean b = locationService.addLocation(locationDto);
        if(b){
            return ResponseEntity.ok().body("Location added successfully");
        }else{
            return ResponseEntity.status(HttpStatus.OK).body("Location insert failed");
        }
    }

    @PutMapping(value = "/updateLocation")
    public ResponseEntity<String> updateLocation(@RequestBody LocationDto locationDto){
        Boolean b = locationService.updateLocation(locationDto);
        if(b){
            return ResponseEntity.ok().body("Location updated");
        }else{
            return ResponseEntity.ok().body("Location update failed");
        }
    }

    @DeleteMapping(value = "/deleteLocation")
    public ResponseEntity<String> deleteLocation(@RequestBody LocationDto locationDto){
        Boolean b = locationService.deleteLocation(locationDto);
        if(b){
            return ResponseEntity.ok().body("Location deleted");
        }else{
            return ResponseEntity.ok().body("Location delete failed");
        }
    }


}
