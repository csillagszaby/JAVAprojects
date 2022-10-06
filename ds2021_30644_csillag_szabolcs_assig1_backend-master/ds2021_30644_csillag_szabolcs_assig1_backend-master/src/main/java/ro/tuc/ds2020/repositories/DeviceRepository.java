package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.Device;

import java.util.List;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    List<Device> findByDescription(String description);

    @Query(value = "SELECT p " +
            "FROM Device p " +
            "WHERE p.clientAccount.id = :clientId " )
    List<Device> findDevicesForAClient(@Param("clientId") UUID clientId);
}
