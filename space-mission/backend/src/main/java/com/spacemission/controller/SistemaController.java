package com.spacemission.controller;

import com.spacemission.model.Sistema;
import com.spacemission.repository.SistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sistemas")
public class SistemaController {

    @Autowired
    private SistemaRepository sistemaRepository;

    // GET /api/sistemas → lista todos
    @GetMapping
    public List<Sistema> listarTodos() {
        return sistemaRepository.findAll();
    }

    // GET /api/sistemas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Sistema> buscarPorId(@PathVariable Long id) {
        Optional<Sistema> sistema = sistemaRepository.findById(id);
        return sistema.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/sistemas/status/{status}
    // Ex: GET /api/sistemas/status/nominal
    @GetMapping("/status/{status}")
    public List<Sistema> buscarPorStatus(@PathVariable String status) {
        return sistemaRepository.findByStatusOperacional(status);
    }

    // POST /api/sistemas → cria novo sistema
    @PostMapping
    public ResponseEntity<Sistema> criar(@RequestBody Sistema sistema) {
        Sistema salvo = sistemaRepository.save(sistema);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // PUT /api/sistemas/{id}/evento → registra um novo evento em sistema existente
    @PutMapping("/{id}/evento")
    public ResponseEntity<Sistema> registrarEvento(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {

        Optional<Sistema> opt = sistemaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Sistema sistema = opt.get();
        sistema.setEvento(body.get("evento"));

        if (body.containsKey("statusOperacional")) {
            sistema.setStatusOperacional(body.get("statusOperacional"));
        }

        return ResponseEntity.ok(sistemaRepository.save(sistema));
    }
}
