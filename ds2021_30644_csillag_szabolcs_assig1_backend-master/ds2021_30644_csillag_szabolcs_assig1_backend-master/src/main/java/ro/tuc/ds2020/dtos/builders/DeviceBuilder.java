package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.entities.Device;

public class DeviceBuilder {

    private DeviceBuilder() {
    }

    public static DeviceDTO toDeviceDTO(Device device) {
        return new DeviceDTO(device.getId(),device.getDescription(),device.getAddress(),
                device.getMaxEnergyConsumption(),device.getAverageEnergyConsumption(),
                ClientAccountBuilder.toClientAccountDTO(device.getClientAccount()));
    }

    public static Device toEntity(DeviceDTO deviceDTO) {
        return new Device(deviceDTO.getId(),deviceDTO.getDescription(),deviceDTO.getAddress(),
                deviceDTO.getMaxEnergyConsumption(),deviceDTO.getAverageEnergyConsumption(),
                ClientAccountBuilder.toEntity(deviceDTO.getClientAccountDTO()));
    }
}
