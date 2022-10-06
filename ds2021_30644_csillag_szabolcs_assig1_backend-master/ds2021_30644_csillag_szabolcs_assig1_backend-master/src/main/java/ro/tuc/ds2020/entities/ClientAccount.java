package ro.tuc.ds2020.entities;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Entity
public class ClientAccount implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "name", nullable = false,unique = true)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "birthDate", nullable = false)
    private String birthDate;

    @Column(name = "isAdmin", nullable = false)
    private String isAdmin;

    @Column(name = "password", nullable = false)
    private String password;

    @OneToMany(mappedBy = "clientAccount")
    private List<Device> devices;


    public ClientAccount() {
    }

    public ClientAccount(UUID id,String name, String address, String birthDate,
                         String isAdmin,String password) {
        this.id=id;
        this.name = name;
        this.address = address;
        this.birthDate=birthDate;
        this.isAdmin=isAdmin;
        this.password=password;
    }

    public ClientAccount(String name, String address, String birthDate,
                         String isAdmin,String password) {
        this.name = name;
        this.address = address;
        this.birthDate=birthDate;
        this.isAdmin=isAdmin;
        this.password=password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Device> getDevices() {
        return devices;
    }

    public void setDevices(List<Device> devices) {
        this.devices = devices;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(String isAdmin) {
        this.isAdmin = isAdmin;
    }
}
