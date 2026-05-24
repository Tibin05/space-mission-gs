package com.spacemission.controller;

import com.spacemission.model.Sensor;
import com.spacemission.repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// @RestController: essa classe responde requisições HTTP com JSON
// @RequestMapping: define o caminho base da URL (/api/sensores)
@RestController
@RequestMapping("/api/sensores")
public class SensorController {

    // @Autowired: o Spring injeta o repository automaticamente (não precisa new)
    @Autowired
    private SensorRepository sensorRepository;

    // =====================================================
    // GET /api/sensores → retorna TODOS os sensores
    // =====================================================
    @GetMapping
    public List<Sensor> listarTodos() {
        return sensorRepository.findAll();
    }

    // =====================================================
    // GET /api/sensores/{id} → retorna sensor por ID
    // Ex: GET /api/sensores/1
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<Sensor> buscarPorId(@PathVariable Long id) {
        Optional<Sensor> sensor = sensorRepository.findById(id);

        // Se encontrou, retorna 200 OK com o sensor
        // Se não encontrou, retorna 404 Not Found
        return sensor.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // =====================================================
    // GET /api/sensores/status/{status}
    // Ex: GET /api/sensores/status/ativo
    // =====================================================
    @GetMapping("/status/{status}")
    public List<Sensor> buscarPorStatus(@PathVariable String status) {
        return sensorRepository.findByStatus(status);
    }

    // =====================================================
    // POST /api/sensores → cria novo sensor
    // O body da requisição vem em JSON e é convertido para Sensor
    // =====================================================
    @PostMapping
    public ResponseEntity<Sensor> criar(@RequestBody Sensor sensor) {
        Sensor salvo = sensorRepository.save(sensor);
        // Retorna 201 Created com o sensor salvo (incluindo o ID gerado)
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // =====================================================
    // GET /api/sensores/resumo → estatísticas rápidas
    // =====================================================
    @GetMapping("/resumo")
    public ResponseEntity<?> resumo() {
        long total = sensorRepository.count();
        long ativos = sensorRepository.findByStatus("ativo").size();
        long falha = sensorRepository.findByStatus("com_falha").size();

        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("total", total);
            put("ativos", ativos);
            put("comFalha", falha);
        }});
    }
}
