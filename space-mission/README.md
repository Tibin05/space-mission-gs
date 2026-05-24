# 🚀 Controle de Missão Espacial

> Solução integrada Backend + Mobile para controle de missões espaciais  
> Disciplina: Advanced Programming And Mobile Dev — FIAP Engenharia da Computação 3º ano

---

## 👥 Integrantes

| Nome Completo                          | RM     |
| -------------------------------------- | ------ |
| Eric Perez Martinez Melillo Siciliano  | 558651 |
| Lucas Costa Sanson                     | 556042 |

---

## 📋 Descrição do Projeto

Sistema integrado composto por:

- **Backend**: API REST em Java com Spring Boot + banco H2 em modo file
- **Mobile**: Aplicativo React Native com Expo e TypeScript

O sistema permite monitorar missões espaciais, gerenciando sensores, sistemas operacionais e alertas críticos em tempo real.

---

## 🏗️ Arquitetura

```
space-mission-gs/
├── space-mission/              # Backend Spring Boot
│   └── src/main/java/com/spacemission/
│       ├── SpaceMissionApplication.java
│       ├── CorsConfig.java
│       ├── model/
│       │   ├── Sensor.java
│       │   ├── Sistema.java
│       │   └── Alerta.java
│       ├── repository/
│       │   ├── SensorRepository.java
│       │   ├── SistemaRepository.java
│       │   └── AlertaRepository.java
│       └── controller/
│           ├── SensorController.java
│           ├── SistemaController.java
│           └── AlertaController.java
│
└── SpaceMissionExpo/           # App React Native + Expo
    ├── App.tsx
    └── src/
        ├── services/api.ts
        ├── navigation/AppNavigator.tsx
        └── screens/
            ├── HomeScreen.tsx
            ├── SensoresScreen.tsx
            ├── SistemasScreen.tsx
            └── AlertasScreen.tsx
```

---

## 🔌 Endpoints da API

### Sensores — `/api/sensores`

| Método | Rota                            | Descrição               |
| ------ | ------------------------------- | ----------------------- |
| GET    | `/api/sensores`                 | Lista todos os sensores |
| GET    | `/api/sensores/{id}`            | Busca sensor por ID     |
| GET    | `/api/sensores/status/{status}` | Filtra por status       |
| GET    | `/api/sensores/resumo`          | Estatísticas gerais     |
| POST   | `/api/sensores`                 | Cadastra novo sensor    |

### Sistemas — `/api/sistemas`

| Método | Rota                            | Descrição               |
| ------ | ------------------------------- | ----------------------- |
| GET    | `/api/sistemas`                 | Lista todos os sistemas |
| GET    | `/api/sistemas/{id}`            | Busca sistema por ID    |
| GET    | `/api/sistemas/status/{status}` | Filtra por status       |
| POST   | `/api/sistemas`                 | Cadastra novo sistema   |
| PUT    | `/api/sistemas/{id}/evento`     | Registra evento         |

### Alertas — `/api/alertas`

| Método | Rota                         | Descrição                    |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/alertas`               | Lista todos os alertas       |
| GET    | `/api/alertas/ativos`        | Lista alertas não resolvidos |
| GET    | `/api/alertas/criticos`      | Lista alertas críticos       |
| GET    | `/api/alertas/resumo`        | Estatísticas                 |
| POST   | `/api/alertas`               | Registra novo alerta         |
| PATCH  | `/api/alertas/{id}/resolver` | Marca como resolvido         |

---

## ▶️ Como Rodar

### Backend

**Pré-requisitos:** Java 17+, Maven

```bash
cd space-mission/backend
mvn spring-boot:run
```

A API ficará disponível em: `http://localhost:8080`  
Console H2 (banco de dados): `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:file:./data/spacemission`
- User: `sa` | Senha: *(vazio)*

### Mobile

**Pré-requisitos:** Node.js, Expo CLI

```bash
cd SpaceMissionExpo
npm install
npx expo start
```

Após iniciar, escolha uma das opções abaixo:

**Opção 1 — Celular físico (sem precisar instalar Android Studio):**
1. Instale o app **Expo Go** no seu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
2. Escaneie o QR Code que aparece no terminal com o app Expo Go
3. O app abrirá diretamente no seu celular

> ⚠️ Para dispositivo físico, altere a URL da API em `src/services/api.ts` para o IP da sua máquina (ex: `http://192.168.0.10:8080`). Celular e computador devem estar na mesma rede Wi-Fi.

**Opção 2 — Emulador Android (requer Android Studio):**
1. Instale o [Android Studio](https://developer.android.com/studio) e configure um dispositivo virtual
2. Com o emulador aberto, pressione `a` no terminal do Expo
3. A URL da API já está configurada como `http://10.0.2.2:8080` para funcionar no emulador

---

## 📱 Funcionalidades do App

- **Home**: Dashboard com totais de sensores, sistemas e alertas
- **Sensores**: Listagem (GET) + formulário de cadastro (POST)
- **Sistemas**: Listagem (GET) + cadastro (POST)
- **Alertas**: Listagem (GET) + filtro de ativos + cadastro (POST)
- Pull-to-refresh em todas as telas
- Modal de cadastro com validação de campos

---

## 🗄️ Exemplos de JSON para Teste

**POST /api/sensores**
```json
{
  "nome": "Sensor de Temperatura - Módulo A",
  "tipo": "temperatura",
  "status": "ativo",
  "leituraAtual": 23.5,
  "unidade": "°C",
  "moduloInstalado": "Módulo A"
}
```

**POST /api/sistemas**
```json
{
  "nome": "Sistema de Propulsão Principal",
  "descricao": "Controla os motores principais da nave",
  "statusOperacional": "nominal",
  "responsavel": "Engenheiro João",
  "nivelEnergia": 87.5
}
```

**POST /api/alertas**
```json
{
  "tipo": "temperatura_critica",
  "descricao": "Temperatura do reator excedeu 450°C",
  "nivelCriticidade": "critico",
  "origem": "Sensor de Temperatura - Módulo A"
}
```
