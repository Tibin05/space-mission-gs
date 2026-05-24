package com.spacemission.repository;

import com.spacemission.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// JpaRepository<Sensor, Long>:
//   - Sensor = a entidade que queremos gerenciar
//   - Long   = o tipo do ID (nossa chave primária)
//
// O Spring cria automaticamente os métodos:
//   - save(sensor)         → INSERT / UPDATE
//   - findAll()            → SELECT * FROM sensores
//   - findById(id)         → SELECT * WHERE id = ?
//   - deleteById(id)       → DELETE WHERE id = ?
//   - count()              → SELECT COUNT(*)

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {

    // Método extra: busca sensores por tipo
    // O Spring entende o nome "findByTipo" e gera o SQL automaticamente!
    List<Sensor> findByTipo(String tipo);

    // Busca por status
    List<Sensor> findByStatus(String status);

    // Busca por módulo instalado
    List<Sensor> findByModuloInstalado(String modulo);
}
