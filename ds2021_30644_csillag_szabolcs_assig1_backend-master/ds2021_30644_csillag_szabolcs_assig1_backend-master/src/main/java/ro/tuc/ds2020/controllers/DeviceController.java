package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.builders.ClientAccountBuilder;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.services.ClientAccountService;
import ro.tuc.ds2020.services.DeviceService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {

    private final DeviceService deviceService;
    private final ClientAccountService clientAccountService;

    @Autowired
    public DeviceController(DeviceService deviceService, ClientAccountService clientAccountService) {
        this.deviceService = deviceService;
        this.clientAccountService = clientAccountService;
    }

    @GetMapping()
    public ResponseEntity<List<DeviceDTO>> getDevices() {
        List<DeviceDTO> dtos = deviceService.findDevice();
        for (DeviceDTO dto : dtos) {
            Link deviceLink = linkTo(methodOn(DeviceController.class)
                    .getDevice(dto.getId())).withRel("Devices");
            dto.add(deviceLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping(value = "/{id}")
    public ResponseEntity<UUID> insertProsumer(@PathVariable("id") UUID clientId,@Valid @RequestBody DeviceDTO deviceDTO) {
        deviceDTO.setClientAccountDTO(ClientAccountBuilder.toClientAccountDTO(clientAccountService.findClientAccountById(clientId)));
        UUID deviceID = deviceService.insert(deviceDTO);
        return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<DeviceDTO> getDevice(@PathVariable("id") UUID deviceId) {
        DeviceDTO dto = DeviceBuilder.toDeviceDTO(deviceService.findDeviceById(deviceId));
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping(value = "/oneclient/{id}")
    public ResponseEntity<List<DeviceDTO>> getDevicesForAClient(@PathVariable("id") UUID clientId) {
        List<DeviceDTO> dtos = deviceService.findDevicesForAClient(clientId);
        for (DeviceDTO dto : dtos) {
            Link deviceLink = linkTo(methodOn(DeviceController.class)
                    .getDevice(dto.getId())).withRel("Devices");
            dto.add(deviceLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<UUID> deleteDevice(@PathVariable("id") UUID id) {
        this.deviceService.delete(id);
        return new ResponseEntity<>(id,HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UUID> updateProsumer(@PathVariable("id") UUID clientId,@Valid @RequestBody DeviceDTO deviceDTO) {
        deviceDTO.setClientAccountDTO(ClientAccountBuilder.toClientAccountDTO(clientAccountService.findClientAccountById(clientId)));
        UUID deviceID = deviceService.update(deviceDTO);
        return new ResponseEntity<>(deviceID, HttpStatus.OK);
    }

}
