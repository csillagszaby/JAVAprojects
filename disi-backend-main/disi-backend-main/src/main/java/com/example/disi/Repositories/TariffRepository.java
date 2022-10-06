package com.example.disi.Repositories;

import com.example.disi.Entities.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TariffRepository extends JpaRepository<Tariff,Long> {

    List<Tariff> findAll();

}
