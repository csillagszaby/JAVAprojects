package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.Sensor;

import java.util.List;
import java.util.UUID;

public interface SensorRepository extends JpaRepository<Sensor, UUID> {

    List<Sensor> findBySensorDescription(String sensorDescription);

    @Query(value = "SELECT p " +
            "FROM Sensor p " +
            "WHERE p.device.clientAccount.id = :clientId " )
    List<Sensor> findSensorsForAClient(@Param("clientId") UUID clientId);
}
