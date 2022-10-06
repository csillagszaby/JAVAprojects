package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;
import java.util.Objects;
import java.util.UUID;

public class ClientAccountDTO extends RepresentationModel<ClientAccountDTO> {
    private UUID id;
    private String name;
    private String address;
    private String birthdate;
    private String isAdmin;
    private String password;

    public ClientAccountDTO() {
    }

    public ClientAccountDTO(UUID id, String name, String address, String birthDate,String isAdmin,String password) {
        this.id = id;
        this.name = name;
        this.address=address;
        this.birthdate=birthDate;
        this.isAdmin=isAdmin;
        this.password=password;
    }
    public ClientAccountDTO( String name, String address, String birthDate,String isAdmin,String password) {
        this.name = name;
        this.address=address;
        this.birthdate=birthDate;
        this.isAdmin=isAdmin;
        this.password=password;
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

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(String isAdmin) {
        this.isAdmin = isAdmin;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClientAccountDTO clientAccountsDTO = (ClientAccountDTO) o;
        return Objects.equals(name, clientAccountsDTO.name) && Objects.equals(address,clientAccountsDTO.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, address);
    }
}
