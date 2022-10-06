package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.util.Objects;
import java.util.UUID;

public class DeviceDTO extends RepresentationModel<DeviceDTO> {
    private UUID id;
    private String description;
    private String address;
    private int maxEnergyConsumption;
    private int averageEnergyConsumption;
    private ClientAccountDTO clientAccountDTO;

    public ClientAccountDTO getClientAccountDTO() {
        return clientAccountDTO;
    }

    public void setClientAccountDTO(ClientAccountDTO clientAccountDTO) {
        this.clientAccountDTO = clientAccountDTO;
    }

    public DeviceDTO() {
    }
    public DeviceDTO( UUID id,String description, String address, int maxEnergyConsumption, int averageEnergyConsumption,ClientAccountDTO clientAccountDTO) {
        this.id=id;
        this.description = description;
        this.address = address;
        this.maxEnergyConsumption = maxEnergyConsumption;
        this.averageEnergyConsumption = averageEnergyConsumption;
        this.clientAccountDTO=clientAccountDTO;
    }


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getMaxEnergyConsumption() {
        return maxEnergyConsumption;
    }

    public void setMaxEnergyConsumption(int maxEnergyConsumption) {
        this.maxEnergyConsumption = maxEnergyConsumption;
    }

    public int getAverageEnergyConsumption() {
        return averageEnergyConsumption;
    }

    public void setAverageEnergyConsumption(int averageEnergyConsumption) {
        this.averageEnergyConsumption = averageEnergyConsumption;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDTO deviceDTO = (DeviceDTO) o;
        return Objects.equals(description, deviceDTO.description) && Objects.equals(address, deviceDTO.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(description, address);
    }
}
