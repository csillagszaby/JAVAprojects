
package ro.tuc.ds2020.entities;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class Device implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "maxEnergyConsumption", nullable = false)
    private int maxEnergyConsumption;

    @Column(name = "averageEnergyConsumption", nullable = false)
    private int averageEnergyConsumption;

    @OneToOne(mappedBy = "device")
    private Sensor sensor;

    @JoinColumn(name = "clientId")
    @ManyToOne
    private ClientAccount clientAccount;

    public Device(UUID id, String description, String address, int maxEnergyConsumption, int averageEnergyConsumption, ClientAccount clientAccount) {
        this.id=id;
        this.description = description;
        this.address = address;
        this.maxEnergyConsumption = maxEnergyConsumption;
        this.averageEnergyConsumption = averageEnergyConsumption;
        this.clientAccount=clientAccount;
    }

    public ClientAccount getClientAccount() {
        return clientAccount;
    }

    public void setClientAccount(ClientAccount clientAccount) {
        this.clientAccount = clientAccount;
    }

    public Device() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getMaxEnergyConsumption() {
        return maxEnergyConsumption;
    }

    public void setMaxEnergyConsumption(int maxEnergyConsumption) {
        this.maxEnergyConsumption = maxEnergyConsumption;
    }

    public int getAverageEnergyConsumption() {
        return averageEnergyConsumption;
    }

    public void setAverageEnergyConsumption(int averageEnergyConsumption) {
        this.averageEnergyConsumption = averageEnergyConsumption;
    }

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }
}
