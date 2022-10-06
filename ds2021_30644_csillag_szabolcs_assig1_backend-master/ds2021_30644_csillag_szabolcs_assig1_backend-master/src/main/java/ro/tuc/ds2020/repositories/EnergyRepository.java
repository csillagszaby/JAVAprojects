package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.Energy;

import java.util.List;
import java.util.UUID;

public interface EnergyRepository extends JpaRepository<Energy, UUID> {

    @Query(value = "SELECT p " +
            "FROM Energy p " +
            "WHERE p.sensor.device.clientAccount.id = :clientId " )
    List<Energy> findEnergysForAClient(@Param("clientId") UUID clientId);
}
