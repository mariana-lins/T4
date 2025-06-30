# Sistema World Beauty - Atividade IV
**Integração Frontend React + Backend REST API**

---

## Objetivo da Atividade

Desenvolver uma aplicação **frontend** que se comunique com uma aplicação **backend REST**, implementando operações **CRUD de clientes** através de uma interface gráfica.

---

## Arquitetura Implementada

```
ATV4/
├── backend/           # Spring Boot + Java (API REST)
├── frontend/          # React + TypeScript (Interface)
├── executavel/        # JAR para execução rápida
└── README.md         # Esta documentação
```

### Fluxo de Comunicação
```
Frontend (React) ──── JSON via HTTP ──── Backend (Java)
     ↕                                        ↕
Interface Gráfica                      Banco H2 (memória)
```

---

## Especificações da Atividade

### Requisitos Atendidos

1. **Pré-projeto Backend Java** - Utilizado conforme fornecido
2. **Endpoints REST** - Todos implementados e funcionais
3. **Comunicação JSON** - Frontend Backend via JSON
4. **CRUD Completo** - Listar, cadastrar, atualizar, excluir clientes
5. **Interface Gráfica** - GUI 
6. **Separação Frontend/Backend** - Arquitetura modular

**Estrutura JSON Especificada:**
```json
{
  "nome": "Pedro Alcântara de Bragança e Bourbon",
  "sobreNome": "Dom Pedro", 
  "endereco": {
    "estado": "Rio de Janeiro",
    "cidade": "Rio de Janeiro",
    "bairro": "Centro", 
    "rua": "Praça Quinze de Novembro",
    "numero": "48",
    "codigoPostal": "20010-010",
    "informacoesAdicionais": "Paço Imperial"
  }
}
```

**Implementação Atual:**
- **Campos obrigatórios**: Todos da especificação 
- **Campos extras**: Email, telefones 
- **Campos simulados**: CPF, RG, gênero (apenas frontend)

---

## Endpoints REST Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/clientes` | Lista todos os clientes |
| `GET` | `/cliente/{id}` | Busca cliente por ID |
| `POST` | `/cliente/cadastrar` | Cadastra novo cliente |
| `PUT` | `/cliente/atualizar` | Atualiza cliente existente |
| `DELETE` | `/cliente/excluir` | Exclui cliente |

### URLs de Acesso
- **Frontend**: http://localhost:5177
- **Backend API**: http://localhost:8080  
- **H2 Console**: http://localhost:8080/h2-console

---

## Como Executar

### Opção 1: Execução Rápida (JAR)
```powershell
# Terminal 1: Backend
cd executavel
java -jar wbbackend.jar --server.port=8080

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev
```

### Opção 2: Desenvolvimento (Código Fonte)
```powershell
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend  
npm install
npm run dev
```

### Pré-requisitos
- **Java 17+** (para executar backend)
- **Node.js** (para executar frontend)
- **Maven** (se compilar backend do código fonte)

### Troubleshooting

#### Backend não inicia na porta 8080
**Problema**: JAR roda em porta aleatória (ex: 32832)  
**Solução**: Use `--server.port=8080` ao executar o JAR:
```powershell
java -jar wbbackend.jar --server.port=8080
```

#### API não está disponível
1. **Verifique se o backend está rodando**: Veja se há logs de inicialização
2. **Confirme a porta**: Deve mostrar "Tomcat started on port(s): 8080"
3. **Teste manualmente**: Acesse http://localhost:8080/clientes no browser
4. **Verifique conflitos**: Certifique-se que a porta 8080 não está em uso

---

## Tecnologias Utilizadas

### Backend (Java)
- **Java 21** + **Spring Boot 3.2.0**
- **JPA/Hibernate** (persistência)
- **Lombok** (redução de código)
- **H2 Database** (banco em memória)
- **Maven** (gerenciamento de dependências)
- **HATEOAS** (navegação REST)

### Frontend (React)
- **React 19** + **TypeScript**
- **Material-UI** (interface moderna)
- **Axios** (cliente HTTP)
- **Vite** (build tool e dev server)
- **Hooks** (gerenciamento de estado)

---

## Funcionalidades Implementadas

### CRUD Completo de Clientes
- **Create**: Cadastro via formulário validado
- **Read**: Listagem e visualização individual  
- **Update**: Edição de dados existentes
- **Delete**: Exclusão com confirmação

### Interface Gráfica
- **Material-UI responsiva** (desktop/mobile)
- **Validação em tempo real** de formulários
- **Feedback visual** de operações (loading, sucesso, erro)
- **Tratamento de erros** da API

### Gestão de Dados
- **4 clientes históricos** pré-carregados
- **Dados em memória** (reinicia a cada execução)
- **Validação de campos** obrigatórios
- **Simulação de campos** (CPF, RG, gênero no frontend)

---

## Comandos de Teste (PowerShell)

```powershell
# Testar API - Listar clientes
Invoke-RestMethod -Uri "http://localhost:8080/clientes" -Method GET

# Testar API - Buscar cliente específico  
Invoke-RestMethod -Uri "http://localhost:8080/cliente/1" -Method GET

# Verificar se frontend está rodando
Invoke-RestMethod -Uri "http://localhost:5177" -Method GET
```

---

## Detalhes Técnicos

### Estrutura do Banco
```sql
-- Tabelas criadas automaticamente pelo Hibernate
Cliente (id, nome, sobreNome, email, endereco_id)
Endereco (id, estado, cidade, bairro, rua, numero, codigoPostal, informacoesAdicionais)  
Telefone (id, ddd, numero)
Cliente_Telefones (cliente_id, telefones_id)
```

### Configurações de Rede
- **Backend**: Porta 8080 (padrão Spring Boot)
- **Frontend**: Porta 5177 (ou próxima disponível)
- **CORS**: Configurado para http://localhost:5177
- **Content-Type**: application/json

### Validações
- **Frontend**: Campos obrigatórios, formatos de email/telefone
- **Backend**: Validação JPA automática
- **Integração**: Apenas campos suportados enviados à API

---

## Observações Importantes

### Sobre o Lombok
- **Uso**: Gera automaticamente getters/setters via anotações
- **IDE**: Pode mostrar "erros" falsos (ignore)
- **Maven**: Compila perfeitamente (é o que importa)
- **Vantagem**: 80% menos código manual

### Sobre o Banco H2
- **Tipo**: Em memória (dados perdidos ao reiniciar)
- **Console**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:[id-gerado]` (ver logs)
- **Usuário**: `SA` | **Senha**: (vazio)

### Campos Simulados
- **CPF, RG, Gênero**: Apenas no frontend (UX melhorada)
- **Não são enviados** para o backend
- **Demonstram separação** de responsabilidades

---

## Estrutura Conforme Atividade

### Aspectos Arquiteturais Atendidos
1. **Separação de responsabilidades** 
2. **Comunicação modular** via JSON 
3. **Frontend independente** do backend
4. **Sistema stateless** 
5. **Flexibilidade da interface** 

### Aprendizados Demonstrados
- **Integração Frontend-Backend** via REST
- **Comunicação HTTP** com tratamento de erros
- **Arquitetura de microsserviços** (princípios)
- **Separação UI/Dados** na prática
- **Desenvolvimento modular** e independente

---

**Disciplina**: Programação Orientada a Objetos  
**Professor**: Dr. Eng. Gerson Penha  
**Aluna:** Mariana Lins  
**Atividade**: IV - Integração Frontend/Backend REST  
