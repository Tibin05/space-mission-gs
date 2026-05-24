package com.spacemission.repository;

import com.spacemission.model.Sistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SistemaRepository extends JpaRepository<Sistema, Long> {

    List<Sistema> findByStatusOperacional(String status);

    List<Sistema> findByNomeContainingIgnoreCase(String nome);
}
