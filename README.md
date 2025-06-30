# Sistema World Beauty — Atividade IV

**Integração Frontend React + Backend Java REST para CRUD de Clientes.**

---

## Objetivo

Desenvolver uma aplicação com:

- **Frontend React + TypeScript**
- **Backend Java Spring Boot (RESTful API)**
- **CRUD completo** de clientes
- **Banco H2 em memória**

---

## Estrutura

```
T4/
├── backend/   # API REST Java
├── frontend/  # React + TS
├── executavel/ # JAR backend pronto
└── README.md
```

### Fluxo

```
Frontend (React) ←→ JSON/HTTP ←→ Backend (Java REST) ←→ H2 Database
```

---

## Funcionalidades

- Listar, cadastrar, atualizar e excluir clientes
- Interface moderna com Material-UI
- Validação em tempo real de formulários
- Dados em memória, reiniciados a cada execução
- Campos simulados: CPF, RG, gênero (frontend)

---

## Endpoints Principais

| Método | Rota               | Descrição        |
| ------ | ------------------ | ---------------- |
| GET    | /clientes          | Lista clientes   |
| POST   | /cliente/cadastrar | Cria cliente     |
| PUT    | /cliente/atualizar | Atualiza cliente |
| DELETE | /cliente/excluir   | Remove cliente   |

**Frontend:** [http://localhost:5177](http://localhost:5177)\
**Backend:** [http://localhost:8080](http://localhost:8080)\
**H2 Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## Como Rodar

### Usando JAR

```
# Backend
cd executavel
java -jar wbbackend.jar --server.port=8080

# Frontend
cd frontend
npm install
npm run dev
```

### Código-fonte

```
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

**Requisitos:** Java 17+, Node.js, Maven

---

## Banco H2

- **Em memória**: recria a cada execução
- Console: `/h2-console` | JDBC: `jdbc:h2:mem:[id]` | Usuário: `SA`

---

## Tecnologias

- **Backend**: Java 21, Spring Boot 3, JPA/Hibernate, Lombok, H2
- **Frontend**: React 19, TypeScript, Vite, Material-UI, Axios

---

## Resumo

- API RESTful com separação de responsabilidades
- Comunicação Frontend/Backend via JSON
- CRUD de clientes validado

**Disciplina:** Programação Orientada a Objetos\
**Professor:** Dr. Eng. Gerson Penha\
**Aluna:** Mariana Lins  
**Atividade IV:** Integração Frontend/Backend CRUD

