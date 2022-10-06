package com.example.disi.Services;

import com.example.disi.DTOs.LocationDto;
import com.example.disi.Entities.Location;
import com.example.disi.Repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    LocationRepository locationRepository;

    public List<LocationDto> getAllLocations(){
        List<Location> l= locationRepository.findAll();
        List<LocationDto> ldto = new ArrayList<>();
        for(Location loc: l){
            ldto.add(new LocationDto(loc.getId(),loc.getDetails()));
        }
        return ldto;

    }

    public Boolean addLocation(LocationDto locationDto){
        if(locationDto.getDetails().isEmpty()){
            return false;
        }
        Location l = new Location(locationDto.getId(),locationDto.getDetails());
        locationRepository.save(l);
        return true;
    }

    public Boolean updateLocation(LocationDto locationDto){
        Optional<Location> OptLocation = locationRepository.findById(locationDto.getId());
        if(OptLocation.isPresent()){
            Location l = OptLocation.get();
            l.setDetails(locationDto.getDetails());
            locationRepository.save(l);
            return true;
        }
        return false;
    }

    public Boolean deleteLocation(LocationDto locationDto){
        Optional<Location> OptLocation = locationRepository.findById(locationDto.getId());
        if(OptLocation.isPresent()){
            Location l = OptLocation.get();
            locationRepository.delete(l);
            return true;
        }
        return false;
    }
}
