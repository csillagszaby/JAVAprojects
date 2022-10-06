package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.ClientAccountDTO;
import ro.tuc.ds2020.dtos.builders.ClientAccountBuilder;
import ro.tuc.ds2020.services.ClientAccountService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/client")
public class ClientAccountController {

    private final ClientAccountService clientAccountService;

    @Autowired
    public ClientAccountController(ClientAccountService clientAccountService) {
        this.clientAccountService = clientAccountService;
    }

    @GetMapping()
    public ResponseEntity<List<ClientAccountDTO>> getClientAccounts() {
        List<ClientAccountDTO> dtos = clientAccountService.findClientAccount();
        for (ClientAccountDTO dto : dtos) {
            Link clientAccountLink = linkTo(methodOn(ClientAccountController.class)
                    .getClientAccount(dto.getId())).withRel("clientAccount");
            dto.add(clientAccountLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<UUID> insertProsumer(@Valid @RequestBody ClientAccountDTO clientAccountDTO) {
        UUID clientAccountID = clientAccountService.insert(clientAccountDTO);
        return new ResponseEntity<>(clientAccountID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ClientAccountDTO> getClientAccount(@PathVariable("id") UUID clientAccountId) {
        ClientAccountDTO dto = ClientAccountBuilder.toClientAccountDTO(clientAccountService.findClientAccountById(clientAccountId));
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping(value = "/account/{name}")
    public ResponseEntity<ClientAccountDTO> getClientAccountByName(@PathVariable("name") String clientName) {
        ClientAccountDTO dto = ClientAccountBuilder.toClientAccountDTO(clientAccountService.findClientAccountByName(clientName));
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<UUID> deleteClientAccount(@PathVariable("id") UUID id) {
        this.clientAccountService.delete(id);
        return new ResponseEntity<>(id,HttpStatus.OK);
    }

    @PutMapping()
    public ResponseEntity<UUID> updateProsumer(@Valid @RequestBody ClientAccountDTO clientAccountDTO) {
        UUID clientAccountID = clientAccountService.update(clientAccountDTO);
        return new ResponseEntity<>(clientAccountID, HttpStatus.OK);
    }

}
