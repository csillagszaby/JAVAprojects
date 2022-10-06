package ro.tuc.ds2020.entities;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Entity
public class Sensor implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "sensorDescription", nullable = false)
    private String sensorDescription;

    @Column(name = "maximumValue", nullable = false)
    private int maximumValue;

    @JoinColumn(name = "device")
    @OneToOne
    private Device device;

    @OneToMany(mappedBy = "sensor")
    private List<Energy> energys;

    public Sensor() {

    }

    public Sensor(String sensorDescription, int maximumValue) {
        this.sensorDescription=sensorDescription;
        this.maximumValue = maximumValue;
    }

    public Sensor(UUID id, String sensorDescription, int maximumValue, Device device) {
        this.id=id;
        this.sensorDescription=sensorDescription;
        this.maximumValue = maximumValue;
        this.device=device;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSensorDescription() {
        return sensorDescription;
    }

    public void setSensorDescription(String sensorDescription) {
        this.sensorDescription=sensorDescription;
    }

    public int getMaximumValue() {
        return maximumValue;
    }

    public void setMaximumValue(int maximumValue) {
        this.maximumValue = maximumValue;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }
}
