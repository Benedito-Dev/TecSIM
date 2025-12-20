# TecSim - Execução com Docker

## Como rodar o projeto completo (Backend + Mobile + Web)

### Pré-requisitos
- Docker Desktop instalado e rodando
- Portas 3000, 5173, 8081, 19000-19002 disponíveis

### Execução em 1 clique

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
docker-compose up --build
```

### Acessos após inicialização

- **Backend API**: http://localhost:3000
- **Web (React)**: http://localhost:5173  
- **Mobile (Expo)**: http://localhost:19002 (DevTools)
- **Mobile Metro**: http://localhost:8081

### Para parar todos os serviços
```bash
docker-compose down
```

### Estrutura dos serviços
- `tecsim-backend`: API Node.js na porta 3000
- `tecsim-web`: Frontend React/Vite na porta 5173
- `tecsim-mobile`: App Expo nas portas 8081, 19000-19002

### Comunicação entre containers
Os containers se comunicam usando os nomes dos serviços:
- Mobile e Web fazem requests para `http://backend:3000`
- Não é necessário configurar IPs manualmente