package com.example.disi.Controllers;

import com.example.disi.DTOs.TariffDto;
import com.example.disi.Services.TariffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(exposedHeaders = "authorization")
@RequestMapping(value = "/tariff")
public class TariffController {

    @Autowired
    TariffService tariffService;

    @PostMapping(value = "/registerTariff")
    public ResponseEntity<String> registerTariff(@RequestBody TariffDto tariffDto){
        Boolean b = tariffService.registerTariff(tariffDto);
        if(b){
            return ResponseEntity.ok().body("Tariff updated");
        }else{
            return ResponseEntity.ok().body("Tariff cannot be updated");
        }
    }
}
