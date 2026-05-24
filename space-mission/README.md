# 🚀 Controle de Missão Espacial

> Solução integrada Backend + Mobile para controle de missões espaciais  
> Disciplina: Advanced Programming And Mobile Dev — FIAP Engenharia da Computação 3º ano

---

## 👥 Integrantes

| Nome Completo | RM |
|---|---|
| [Nome 1] | RM-XXXXX |
| [Nome 2] | RM-XXXXX |
| [Nome 3] | RM-XXXXX |

---

## 📋 Descrição do Projeto

Sistema integrado composto por:

- **Backend**: API REST em Java com Spring Boot + banco H2 em modo file
- **Mobile**: Aplicativo React Native com TypeScript

O sistema permite monitorar missões espaciais, gerenciando sensores, sistemas operacionais e alertas críticos em tempo real.

---

## 🏗️ Arquitetura

```
space-mission/
├── backend/                    # API Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/spacemission/
│       ├── SpaceMissionApplication.java   # Ponto de entrada
│       ├── CorsConfig.java                # Configuração CORS
│       ├── model/
│       │   ├── Sensor.java                # Entidade 1
│       │   ├── Sistema.java               # Entidade 2
│       │   └── Alerta.java                # Entidade 3
│       ├── repository/
│       │   ├── SensorRepository.java
│       │   ├── SistemaRepository.java
│       │   └── AlertaRepository.java
│       └── controller/
│           ├── SensorController.java
│           ├── SistemaController.java
│           └── AlertaController.java
│
└── mobile/                     # App React Native
    ├── App.tsx
    └── src/
        ├── services/api.ts     # Todas as chamadas HTTP
        ├── navigation/AppNavigator.tsx
        └── screens/
            ├── HomeScreen.tsx      # Dashboard geral
            ├── SensoresScreen.tsx  # CRUD de sensores
            ├── SistemasScreen.tsx  # CRUD de sistemas
            └── AlertasScreen.tsx   # CRUD de alertas
```

---

## 🔌 Endpoints da API

### Sensores (`/api/sensores`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/sensores` | Lista todos os sensores |
| GET | `/api/sensores/{id}` | Busca sensor por ID |
| GET | `/api/sensores/status/{status}` | Filtra por status |
| GET | `/api/sensores/resumo` | Estatísticas gerais |
| POST | `/api/sensores` | Cadastra novo sensor |

### Sistemas (`/api/sistemas`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/sistemas` | Lista todos os sistemas |
| GET | `/api/sistemas/{id}` | Busca sistema por ID |
| GET | `/api/sistemas/status/{status}` | Filtra por status |
| POST | `/api/sistemas` | Cadastra novo sistema |
| PUT | `/api/sistemas/{id}/evento` | Registra evento |

### Alertas (`/api/alertas`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/alertas` | Lista todos os alertas |
| GET | `/api/alertas/ativos` | Lista alertas não resolvidos |
| GET | `/api/alertas/criticos` | Lista alertas críticos |
| GET | `/api/alertas/resumo` | Estatísticas |
| POST | `/api/alertas` | Registra novo alerta |
| PATCH | `/api/alertas/{id}/resolver` | Marca como resolvido |

---

## ▶️ Como Rodar

### Backend

**Pré-requisitos:** Java 17+, Maven

```bash
cd backend
mvn spring-boot:run
```

A API ficará em: `http://localhost:8080`  
Console H2 (banco): `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/spacemission`
- User: `sa` | Senha: *(vazio)*

### Mobile

**Pré-requisitos:** Node.js, React Native CLI, Android Studio ou Xcode

```bash
cd mobile
npm install
npx react-native run-android   # Para Android
npx react-native run-ios       # Para iOS
```

> ⚠️ **Importante**: Se usar emulador Android, a URL base da API já está configurada  
> como `http://10.0.2.2:8080`. Para dispositivo físico, altere em `src/services/api.ts`  
> para o IP da sua máquina (ex: `http://192.168.0.10:8080`).

---

## 📱 Funcionalidades do App

- **Tela Home**: Dashboard com totais de sensores e alertas
- **Tela Sensores**: Lista todos os sensores (GET) + formulário para cadastrar (POST)
- **Tela Sistemas**: Lista sistemas monitorados (GET) + cadastro (POST)
- **Tela Alertas**: Lista alertas (GET) + filtro de ativos + cadastro (POST)
- Pull-to-refresh em todas as telas
- Modal de cadastro com validação

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
