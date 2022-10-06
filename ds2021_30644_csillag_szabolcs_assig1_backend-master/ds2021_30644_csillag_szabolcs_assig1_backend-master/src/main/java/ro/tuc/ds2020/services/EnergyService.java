package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;

import ro.tuc.ds2020.dtos.EnergyDTO;
import ro.tuc.ds2020.dtos.builders.EnergyBuilder;
import ro.tuc.ds2020.dtos.builders.SensorBuilder;
import ro.tuc.ds2020.entities.Energy;
import ro.tuc.ds2020.entities.Sensor;
import ro.tuc.ds2020.repositories.EnergyRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EnergyService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EnergyService.class);
    private final EnergyRepository energyRepository;

    @Autowired
    public EnergyService(EnergyRepository energyRepository) {
        this.energyRepository = energyRepository;
    }

    public List<EnergyDTO> findEnergy() {
        List<Energy> energyList = energyRepository.findAll();
        return energyList.stream()
                .map(EnergyBuilder::toEnergyDTO)
                .collect(Collectors.toList());
    }

    public EnergyDTO findEnergyById(UUID id) {
        Optional<Energy> prosumerOptional = energyRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Energy with id {} was not found in db", id);
            throw new ResourceNotFoundException(Energy.class.getSimpleName() + " with id: " + id);
        }
        return EnergyBuilder.toEnergyDTO(prosumerOptional.get());
    }

    public UUID insert(EnergyDTO energyDTO) {
        Energy energy = EnergyBuilder.toEntity(energyDTO);
        energy = energyRepository.save(energy);
        LOGGER.debug("Energy with id {} was inserted in db", energy.getId());
        return energy.getId();
    }

    public void delete(UUID id) {
        energyRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException(Energy.class.getSimpleName() + " with id: " + id)
        );
        energyRepository.deleteById(id);
    }

    public UUID update(EnergyDTO energyDTO) {
        Energy energy = EnergyBuilder.toEntity(energyDTO);
        energy = energyRepository.save(energy);
        return energy.getId();
    }

    public List<EnergyDTO> findEnergysForAClient(UUID clientId) {
        List<Energy> energyList = energyRepository.findEnergysForAClient(clientId);
        return energyList.stream()
                .map(EnergyBuilder::toEnergyDTO)
                .collect(Collectors.toList());
    }
}
