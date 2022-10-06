package com.example.disi.Controllers;

import com.example.disi.DTOs.AddCourtDto;
import com.example.disi.DTOs.Court.SearchCourtDto;
import com.example.disi.DTOs.CourtDto;
import com.example.disi.DTOs.TimeRangeDto;
import com.example.disi.DTOs.UpdateCourtDto;
import com.example.disi.Entities.Court;
import com.example.disi.Services.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/court")
@RequiredArgsConstructor
public class CourtController {

    private final CourtService courtService;

    @PostMapping(value = "/addCourt")
    public ResponseEntity<String> addCourt(@RequestBody AddCourtDto dto) {
        return new ResponseEntity<String>(courtService.addCourt(dto), HttpStatus.OK);
    }

    @GetMapping(value = "/getAllCourts")
    public ResponseEntity<List<Court>> getAllCourts() {

        return new ResponseEntity<List<Court>>(courtService.getAllCourts(), HttpStatus.OK);
    }

    @PutMapping(value = "/updateCourt")
    public ResponseEntity<String> updateCourt(@RequestBody UpdateCourtDto dto) {
        return new ResponseEntity<String>(courtService.updateCourt(dto), HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteCourt/{idCourt}")
    public ResponseEntity<String> deleteCourt(@PathVariable("idCourt") Long idCourt) {
        return new ResponseEntity<String>(courtService.deleteCourt(idCourt), HttpStatus.OK);
    }

    @GetMapping(value = "/getCourtsForLocation/{idLocation}")
    public ResponseEntity<List<Court>> getCourtsForLocation(@PathVariable("idLocation") Long id) {
        return new ResponseEntity(courtService.getCourtsForLocation(id), HttpStatus.OK);
    }

    @PostMapping(value = "/getAvailableCourts")
    public ResponseEntity<List<CourtDto>> getAvailableCourts(@RequestBody TimeRangeDto timeRangeDto){
        return new ResponseEntity<>(courtService.availableCourts(timeRangeDto),HttpStatus.OK);

    }

    @PostMapping(value = "/seeCourtAvailability")
    public ResponseEntity seeCourtAvailability(@RequestBody SearchCourtDto dto){
        return ResponseEntity.ok().body(courtService.seeCourtAvailability(dto));
    }

}
