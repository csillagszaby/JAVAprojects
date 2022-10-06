package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class EnergyDTO extends RepresentationModel<EnergyDTO> {
    private UUID id;
    private LocalDateTime localDateTime;
    private double value;
    private SensorDTO sensorDTO;

    public EnergyDTO() {
    }

    public EnergyDTO(UUID id, LocalDateTime localDateTime, double value, SensorDTO sensorDTO) {
        this.id = id;
        this.localDateTime = localDateTime;
        this.value = value;
        this.sensorDTO = sensorDTO;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public SensorDTO getSensorDTO() {
        return sensorDTO;
    }

    public void setSensorDTO(SensorDTO sensorDTO) {
        this.sensorDTO = sensorDTO;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EnergyDTO energyDTO = (EnergyDTO) o;
        return value == energyDTO.value &&
                Objects.equals(localDateTime, energyDTO.localDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value, localDateTime);
    }
}
