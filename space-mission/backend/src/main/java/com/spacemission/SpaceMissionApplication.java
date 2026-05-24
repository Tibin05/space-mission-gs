package com.spacemission;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication: ponto de entrada do projeto Spring Boot
@SpringBootApplication
public class SpaceMissionApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpaceMissionApplication.class, args);
        System.out.println("🚀 API de Controle de Missão Espacial rodando em http://localhost:8080");
        System.out.println("🗄️  Console H2 disponível em http://localhost:8080/h2-console");
    }
}
