package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.EnergyDTO;
import ro.tuc.ds2020.entities.Energy;

public class EnergyBuilder {

    private EnergyBuilder() {
    }

    public static EnergyDTO toEnergyDTO(Energy energy) {
        return new EnergyDTO(energy.getId(),energy.getLocalDateTime(), energy.getValue(),
                SensorBuilder.toSensorDTO(energy.getSensor()));
    }

    public static Energy toEntity(EnergyDTO energyDTO) {
        return new Energy(energyDTO.getId(),energyDTO.getLocalDateTime(),energyDTO.getValue(),
                SensorBuilder.toEntity(energyDTO.getSensorDTO()));
    }
}
