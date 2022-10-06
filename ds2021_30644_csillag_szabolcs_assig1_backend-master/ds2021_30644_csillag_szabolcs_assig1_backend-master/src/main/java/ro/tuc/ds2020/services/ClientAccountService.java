package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.ClientAccountDTO;
import ro.tuc.ds2020.dtos.builders.ClientAccountBuilder;
import ro.tuc.ds2020.entities.ClientAccount;
import ro.tuc.ds2020.repositories.ClientAccountRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClientAccountService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ClientAccountService.class);
    private final ClientAccountRepository clientAccountRepository;

    @Autowired
    public ClientAccountService(ClientAccountRepository clientAccountRepository) {
        this.clientAccountRepository = clientAccountRepository;
    }

    public List<ClientAccountDTO> findClientAccount() {
        List<ClientAccount> clientAccountList = clientAccountRepository.findAll();
        return clientAccountList.stream()
                .map(ClientAccountBuilder::toClientAccountDTO)
                .collect(Collectors.toList());
    }

    public ClientAccount findClientAccountById(UUID id) {
        Optional<ClientAccount> prosumerOptional = clientAccountRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("ClientAccount with id {} was not found in db", id);
            throw new ResourceNotFoundException(ClientAccount.class.getSimpleName() + " with id: " + id);
        }
        return prosumerOptional.get();
    }

    public UUID insert(ClientAccountDTO clientAccountDTO) {
        ClientAccount clientAccount = ClientAccountBuilder.toEntity(clientAccountDTO);
        clientAccount = clientAccountRepository.save(clientAccount);
        LOGGER.debug("ClientAccount with id {} was inserted in db", clientAccount.getId());
        return clientAccount.getId();
    }
    public void delete(UUID id) {
        clientAccountRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException(ClientAccount.class.getSimpleName() + " with id: " + id)
        );
        clientAccountRepository.deleteById(id);
    }

    public UUID update(ClientAccountDTO clientAccountDTO) {
        ClientAccount clientAccount = ClientAccountBuilder.toEntity(clientAccountDTO);
        clientAccount = clientAccountRepository.save(clientAccount);
        return clientAccount.getId();
    }

    public ClientAccount findClientAccountByName(String clientName) {
        Optional<ClientAccount> prosumerOptional = clientAccountRepository.findByName(clientName);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("ClientAccount with name {} was not found in db", clientName);
            throw new ResourceNotFoundException(ClientAccount.class.getSimpleName() + " with name: " + clientName);
        }
        return prosumerOptional.get();
    }
}
