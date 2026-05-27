# 📝 TodoList Full Stack

Aplicação full stack de gerenciamento de tarefas com:

- Django REST Framework (Backend)
- React + Vite (Frontend)
- PostgreSQL (Banco de dados)
- Docker (ambiente de desenvolvimento)
- Selenium (testes E2E)

---

# 🚀 1. Como rodar o projeto

## 📦 Pré-requisitos

- Docker
- Docker Compose

---

## ⚙️ Configuração de variáveis de ambiente

Antes de iniciar o projeto, configure os arquivos `.env`.

### 📌 Backend (.env na raiz)

Crie um arquivo `.env` na raiz do projeto:

```env
SECRET_KEY=sua_secret_key_aqui
DEBUG=True

DB_NAME=todolist
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

ALLOWED_HOSTS=localhost,127.0.0.1
```

### 📌 Frontend (.env em Frontend/TodoFront)
```
VITE_API_URL=http://localhost:8000/api
```

## 🐳 Subindo o projeto com Docker

Na raiz do projeto, execute:

```
docker compose up --build
```

### Atenção o Backend pode demorar um pouco mais para subir por causa das dependencias

### 🧱 Rodando migrações (primeira vez)
```
docker compose exec backend uv run python manage.py migrate
```

### Criar superusuário:
```
docker compose exec backend uv run python manage.py createsuperuser
```
### 🌐 Acessos
- Frontend: http://localhost:5173

- Backend API: http://localhost:8000

- Admin Django: http://localhost:8000/admin

## 🏗️ 2. Arquitetura do projeto
### Backend:
- Django REST Framework
- PostgreSQL
- Autenticação + compartilhamento de tarefas

### Frontend:
- React + Vite
- Consumo da API REST

### Infra:
- Docker Compose

## 🔐 3. Funcionalidades

- Cadastro e login de usuários
- CRUD de tarefas
- Categorias
- Compartilhamento de tarefas entre usuários
- Controle de permissões (editar / visualizar)
- Marcação de tarefas como concluídas
- Sistema de convites

## 🧪 4. Testes

### Backend
- pytest
- testes de API
### Frontend
- Selenium (E2E)

### 🗄️ Banco de dados nos testes

Os testes do backend utilizam SQLite em memória por padrão, garantindo:

- execução mais rápida
- isolamento do banco principal (PostgreSQL)
- facilidade de setup em CI/CD

Durante a execução dos testes, o Django automaticamente substitui o banco configurado por SQLite com dados de teste.

## Altere o DEBUG para True no .env

Os testes devem ser rodados localmente sem docker
Se já estiver com o conteiner rodando:
```
docker compose down
```

Rode o django
```
python manage.py migrate
python manage.py runserver
```

Rode o react
```
npm run dev
```

Rode os testes
```
pytest 
```



## 📌 5. Decisões técnicas
- Docker usado apenas para ambiente de execução
- Testes rodados separadamente (CI-ready)
- Frontend desacoplado do backend via REST API
- Selenium usado apenas para validação de fluxo E2E