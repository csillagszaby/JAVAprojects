package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.EnergyDTO;
import ro.tuc.ds2020.services.EnergyService;
import ro.tuc.ds2020.services.SensorService;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/energy")
public class EnergyController {

    private final SensorService sensorService;
    private final EnergyService energyService;

    @Autowired
    public EnergyController(SensorService sensorService, EnergyService energyService) {
        this.sensorService=sensorService;
        this.energyService = energyService;
    }

    @GetMapping()
    public ResponseEntity<List<EnergyDTO>> getEnergys() {
        List<EnergyDTO> dtos = energyService.findEnergy();
        for (EnergyDTO dto : dtos) {
            Link energyLink = linkTo(methodOn(EnergyController.class)
                    .getEnergy(dto.getId())).withRel("Energys");
            dto.add(energyLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping(value = "/{id}")
    public ResponseEntity<UUID> insertProsumer(@PathVariable("id") UUID sensorId,@Valid @RequestBody EnergyDTO energyDTO) {
        energyDTO.setSensorDTO(sensorService.findSensorById(sensorId));
        energyDTO.setLocalDateTime(LocalDateTime.now());
        UUID energyId = energyService.insert(energyDTO);
        return new ResponseEntity<>(energyId, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<EnergyDTO> getEnergy(@PathVariable("id") UUID energyId) {
        EnergyDTO dto = energyService.findEnergyById(energyId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<UUID> deleteEnergy(@PathVariable("id") UUID id) {
        this.energyService.delete(id);
        return new ResponseEntity<>(id,HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UUID> updateProsumer(@PathVariable("id") UUID sensorId,@Valid @RequestBody EnergyDTO energyDTO) {
        energyDTO.setSensorDTO(sensorService.findSensorById(sensorId));
        UUID energyID = energyService.update(energyDTO);
        return new ResponseEntity<>(energyID, HttpStatus.OK);
    }
    @GetMapping(value = "/oneclient/{id}")
    public ResponseEntity<List<EnergyDTO>> getEnergysForAClient(@PathVariable("id") UUID clientId) {
        List<EnergyDTO> dtos = energyService.findEnergysForAClient(clientId);
        for (EnergyDTO dto : dtos) {
            Link energyLink = linkTo(methodOn(EnergyController.class)
                    .getEnergy(dto.getId())).withRel("Energys");
            dto.add(energyLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

}
