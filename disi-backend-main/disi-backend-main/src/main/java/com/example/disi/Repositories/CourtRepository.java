package com.example.disi.Repositories;

import com.example.disi.Entities.Court;
import com.example.disi.Entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {

    Court findFirstById(Long id);

    Court findFirstByLocation(Location location);

    Court findFirstByLocationAndNumber(Location location, Integer number);
}
