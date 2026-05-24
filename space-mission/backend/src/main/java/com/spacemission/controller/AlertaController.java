package com.spacemission.controller;

import com.spacemission.model.Alerta;
import com.spacemission.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    @Autowired
    private AlertaRepository alertaRepository;

    // GET /api/alertas → lista todos
    @GetMapping
    public List<Alerta> listarTodos() {
        return alertaRepository.findAll();
    }

    // GET /api/alertas/ativos → somente alertas não resolvidos
    @GetMapping("/ativos")
    public List<Alerta> listarAtivos() {
        return alertaRepository.findByResolvido(false);
    }

    // GET /api/alertas/criticos → alertas críticos não resolvidos
    @GetMapping("/criticos")
    public List<Alerta> listarCriticos() {
        return alertaRepository.findByResolvidoAndNivelCriticidade(false, "critico");
    }

    // GET /api/alertas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Alerta> buscarPorId(@PathVariable Long id) {
        return alertaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/alertas → cria novo alerta
    @PostMapping
    public ResponseEntity<Alerta> criar(@RequestBody Alerta alerta) {
        Alerta salvo = alertaRepository.save(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // PATCH /api/alertas/{id}/resolver → marca alerta como resolvido
    @PatchMapping("/{id}/resolver")
    public ResponseEntity<Alerta> resolver(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        Optional<Alerta> opt = alertaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Alerta alerta = opt.get();
        alerta.setResolvido(true);

        if (body != null && body.containsKey("acaoTomada")) {
            alerta.setAcaoTomada(body.get("acaoTomada"));
        }

        return ResponseEntity.ok(alertaRepository.save(alerta));
    }

    // GET /api/alertas/resumo → contagem por nível
    @GetMapping("/resumo")
    public ResponseEntity<?> resumo() {
        return ResponseEntity.ok(Map.of(
            "total",    alertaRepository.count(),
            "ativos",   alertaRepository.findByResolvido(false).size(),
            "criticos", alertaRepository.findByNivelCriticidade("critico").size(),
            "altos",    alertaRepository.findByNivelCriticidade("alto").size()
        ));
    }
}
