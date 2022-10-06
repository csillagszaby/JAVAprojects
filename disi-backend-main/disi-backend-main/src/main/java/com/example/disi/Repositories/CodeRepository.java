package com.example.disi.Repositories;

import com.example.disi.Entities.Code;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeRepository extends JpaRepository<Code,Long> {
    Code findFirstByEmail(String email);

}
