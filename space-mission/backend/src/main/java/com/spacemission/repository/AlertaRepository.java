package com.spacemission.repository;

import com.spacemission.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByResolvido(Boolean resolvido);

    List<Alerta> findByNivelCriticidade(String nivel);

    // Busca alertas não resolvidos por nível de criticidade
    List<Alerta> findByResolvidoAndNivelCriticidade(Boolean resolvido, String nivel);
}
