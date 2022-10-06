package com.example.disi.Repositories;

import com.example.disi.Entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person,Long> {

    Optional<Person> findByUsername(String username);
    Optional<Person> findByEmail(String email);
    Optional<Person> findById(Long id);

}
