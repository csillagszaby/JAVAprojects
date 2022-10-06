package ro.tuc.ds2020.entities;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Energy implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "localDateTime", nullable = false)
    private LocalDateTime localDateTime;

    @Column(name = "value", nullable = false)
    private double value;

    @JoinColumn(name = "sensor")
    @ManyToOne
    private Sensor sensor;

    public Energy() {

    }
    public Energy(UUID id,LocalDateTime localDateTime,double value, Sensor sensor) {
        this.id=id;
        this.localDateTime = LocalDateTime.now();
        this.value = value;
        this.sensor = sensor;
    }
    public Energy(double value, Sensor sensor) {
        this.localDateTime = LocalDateTime.now();
        this.value = value;
        this.sensor = sensor;
    }
    public Energy(UUID id, double value, Sensor sensor) {
        this.id = id;
        this.localDateTime = LocalDateTime.now();
        this.value = value;
        this.sensor = sensor;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }
}
