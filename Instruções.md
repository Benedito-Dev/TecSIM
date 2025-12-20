# 🩺 TecSim – Assistente de Enfermagem

**TecSim** é uma aplicação completa de assistência médica composta por **3 plataformas integradas**: Mobile (React Native), Web (React/Vite) e Backend (Node.js), desenvolvida para oferecer **orientações básicas sobre medicamentos**, **triagem inteligente**, **gerenciamento de pacientes** e **cuidados de enfermagem**.

> ⚠️ **Atenção:** Este aplicativo **não substitui avaliação médica profissional**. Todas as informações têm caráter educativo.

---

## 🚀 Funcionalidades

### 📱 **Mobile (React Native + Expo)**
- 🧠 Chat IA com triagem inteligente
- 💊 Consulta de medicamentos e bulas
- 📊 Cálculo automático de dosagens seguras
- ⚖️ Checagem de interações medicamentosas
- 🏠 Dicas caseiras para sintomas leves
- 🚨 Alertas de risco e emergência

### 💻 **Web (React + Vite + Tailwind)**
- 👥 Gerenciamento completo de pacientes
- 📋 Sistema de triagem e atendimento
- 📊 Dashboard com métricas e relatórios
- 💬 Chat integrado com IA
- 🔐 Sistema de autenticação multi-perfil
- 📈 Acompanhamento de tratamentos

### ⚙️ **Backend (Node.js + Express)**
- 🗄️ API REST completa
- 🔒 Autenticação JWT + Rate Limiting
- 📊 Integração com PostgreSQL e MongoDB
- 🤖 Integração com Google Gemini AI
- 📧 Sistema de notificações
- 🧪 Testes automatizados

---

## 🏗️ Arquitetura

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mobile    │    │     Web     │    │   Backend   │
│ React Native│◄──►│ React/Vite  │◄──►│  Node.js    │
│    Expo     │    │  Tailwind   │    │  Express    │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                          ┌───────────────────┼───────────────────┐
                          │                   │                   │
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │ PostgreSQL  │    │  MongoDB    │    │ Google AI   │
                   │   (Neon)    │    │  (Atlas)    │    │   Gemini    │
                   └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 🛠️ Tecnologias

### **Frontend Mobile**
- React Native + Expo
- Expo Router para navegação
- AsyncStorage para persistência
- Axios para requisições HTTP

### **Frontend Web**
- React 18 + Vite
- Tailwind CSS para estilização
- React Router para navegação
- Proxy reverso para comunicação com backend

### **Backend**
- Node.js + Express
- Prisma ORM (PostgreSQL)
- Mongoose (MongoDB)
- JWT para autenticação
- Google Generative AI
- Swagger para documentação

### **Infraestrutura**
- Docker + Docker Compose
- PostgreSQL (Neon Cloud)
- MongoDB (Atlas)
- Proxy reverso Vite

---

## 🚀 Execução com Docker (Recomendado)

### **Pré-requisitos**
- Docker Desktop instalado
- Portas 3000, 5173, 8081, 19000-19002 disponíveis

### **Execução em 1 comando**

```bash
docker-compose up --build
```

### **Acessos**
- **Backend API**: http://localhost:3000
- **Web Dashboard**: http://localhost:5173
- **Mobile DevTools**: http://localhost:19002
- **Mobile Metro**: http://localhost:8081

### **Parar serviços**
```bash
docker-compose down
```

---

## ⚙️ Configuração Manual (Desenvolvimento)

### **1. Configurar variáveis de ambiente**
Crie um arquivo `.env` na raiz com:
```env
# Banco de dados
DATABASE_URL='sua_url_postgresql'
MONGODB_URI='sua_url_mongodb'

# Autenticação
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=30d

# Email
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_app

# Google AI
API_KEY=sua_chave_google_ai
VITE_GOOGLE_API_KEY=sua_chave_google_ai

# Rede (para Docker)
VITE_IP_HOST=localhost
```

### **2. Backend**
```bash
cd backend
npm install
npm run dev
```

### **3. Web**
```bash
cd Web
npm install
npm run dev
```

### **4. Mobile**
```bash
cd Mobile
npm install
npx expo start
```

---

## 🎯 Público-alvo

- **Enfermeiros e técnicos de enfermagem**
- **Estudantes de enfermagem**
- **Cuidadores profissionais**
- **Responsáveis por idosos e crianças**
- **Profissionais de saúde em geral**

---

## 📊 Funcionalidades Avançadas

### **Sistema de Triagem Inteligente**
- Protocolos baseados em sintomas
- Classificação de risco automática
- Recomendações personalizadas
- Integração com IA para análise

### **Gerenciamento de Pacientes**
- Cadastro completo com histórico
- Acompanhamento de tratamentos
- Controle de medicações
- Relatórios de adesão

### **Chat com IA**
- Respostas contextualizadas
- Filtros de segurança
- Histórico de conversas
- Redirecionamentos inteligentes

---

## 🔒 Segurança

- **Autenticação JWT** com refresh tokens
- **Rate limiting** para prevenir abuso
- **Validação rigorosa** de dados
- **Filtros de conteúdo** na IA
- **Logs de auditoria** para monitoramento

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test
npm run test:coverage

# Testes de stress
npm run stress:all
```

---

## 📚 Documentação

- **API**: http://localhost:3000/api-docs (Swagger)
- **Arquitetura**: Ver `/docs/REFATORACAO-CHAT.md`
- **Docker**: Ver `DOCKER-README.md`

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 💡 Inspiração

O TecSim nasceu da necessidade de **democratizar o acesso à informação médica confiável**, unindo **tecnologia moderna** com **cuidados básicos de saúde** de forma **segura**, **gratuita** e **acessível**.

---

## 🆘 Suporte

Em caso de dúvidas:
1. Consulte a documentação
2. Verifique as issues existentes
3. Abra uma nova issue com detalhes
4. Entre em contato com a equipe

---

**Desenvolvido com ❤️ para profissionais de saúde**
