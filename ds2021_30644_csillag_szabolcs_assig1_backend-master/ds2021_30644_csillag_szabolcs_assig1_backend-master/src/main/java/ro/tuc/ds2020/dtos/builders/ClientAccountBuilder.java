package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.ClientAccountDTO;
import ro.tuc.ds2020.entities.ClientAccount;

public class ClientAccountBuilder {

    private ClientAccountBuilder() {
    }

    public static ClientAccountDTO toClientAccountDTO(ClientAccount clientAccount) {
        return new ClientAccountDTO(clientAccount.getId(),clientAccount.getName(),
                clientAccount.getAddress(),clientAccount.getBirthDate(),clientAccount.getIsAdmin(),
                clientAccount.getPassword());
    }

    public static ClientAccount toEntity(ClientAccountDTO clientAccountDTO) {
        return new ClientAccount( clientAccountDTO.getId(),clientAccountDTO.getName(),clientAccountDTO.getAddress(),
                clientAccountDTO.getBirthdate(),clientAccountDTO.getIsAdmin(),
                clientAccountDTO.getPassword());
    }
}
