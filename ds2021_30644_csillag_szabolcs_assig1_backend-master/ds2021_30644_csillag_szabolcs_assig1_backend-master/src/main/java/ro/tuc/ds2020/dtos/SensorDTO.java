package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;
import ro.tuc.ds2020.entities.Device;

import java.util.Objects;
import java.util.UUID;

public class SensorDTO extends RepresentationModel<SensorDTO> {
    private UUID id;
    private String sensorDescription;
    private int maximumValue;
    private DeviceDTO deviceDTO;

    public SensorDTO() {
    }

    public SensorDTO(UUID id, String description, int maximumValue) {
        this.id = id;
        this.sensorDescription = description;
        this.maximumValue = maximumValue;
    }
    public SensorDTO(UUID id, String description, int maximumValue,DeviceDTO deviceDTO) {
        this.id = id;
        this.sensorDescription = description;
        this.maximumValue = maximumValue;
        this.deviceDTO=deviceDTO;
    }

    public SensorDTO(UUID id, String sensorDescription, int maximumValue, Device device) {
    }

    public DeviceDTO getDeviceDTO() {
        return deviceDTO;
    }

    public void setDeviceDTO(DeviceDTO deviceDTO) {
        this.deviceDTO = deviceDTO;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSensorDescription() {
        return sensorDescription;
    }

    public void setDescription(String description) {
        this.sensorDescription = description;
    }

    public int getMaximumValue() {
        return maximumValue;
    }

    public void setMaximumValue(int maximumValue) {
        this.maximumValue = maximumValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SensorDTO devicesDTO = (SensorDTO) o;
        return maximumValue == devicesDTO.maximumValue &&
                Objects.equals(sensorDescription, devicesDTO.sensorDescription);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sensorDescription, maximumValue);
    }
}
