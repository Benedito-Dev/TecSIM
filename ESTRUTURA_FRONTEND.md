# 📋 ESTRUTURA COMPLETA DO FRONTEND - SEGURA CE

## 🎯 VISÃO GERAL

Projeto React moderno utilizando **Vite** como build tool, **Tailwind CSS** para estilização, e arquitetura baseada em **componentes reutilizáveis** com separação clara de responsabilidades.

---

## 📁 ESTRUTURA DE PASTAS DETALHADA

```
FrontEnd/
│
├── public/                          # Arquivos estáticos públicos
│   └── data/                        # Dados JSON estáticos
│       └── sspds-news.json          # Notícias do sistema
│
├── src/                             # Código fonte principal
│   │
│   ├── api/                         # Configuração de APIs
│   │   └── api.js                   # Instância Axios configurada
│   │
│   ├── auth/                        # Autenticação e proteção de rotas
│   │   └── RotaProtegida.jsx        # HOC para rotas protegidas
│   │
│   ├── components/                  # Componentes React organizados
│   │   │
│   │   ├── layout/                  # Componentes de layout global
│   │   │   ├── CookieBanner.jsx     # Banner de cookies LGPD
│   │   │   ├── GovHeader.jsx        # Cabeçalho governamental
│   │   │   ├── Header.jsx           # Cabeçalho principal
│   │   │   ├── LayoutFooter.jsx     # Rodapé do sistema
│   │   │   ├── NavigationManager.jsx # Gerenciador de navegação
│   │   │   ├── NewsHighlight.jsx    # Destaque de notícias
│   │   │   ├── PageContainer.jsx    # Container padrão de páginas
│   │   │   ├── Sidebar.jsx          # Menu lateral
│   │   │   └── UserSessionManager.jsx # Gerenciador de sessão
│   │   │
│   │   ├── pages/                   # Componentes específicos por página
│   │   │   │
│   │   │   ├── accounts/            # Gerenciamento de contas
│   │   │   │   ├── AccountsContent.jsx
│   │   │   │   ├── AccountsHeader.jsx
│   │   │   │   ├── AccountsStats.jsx
│   │   │   │   ├── AccountsTable.jsx
│   │   │   │   ├── ActivityTimeline.jsx
│   │   │   │   ├── CreateAccountModal.jsx
│   │   │   │   └── PermissionPanel.jsx
│   │   │   │
│   │   │   ├── analysis/            # Análises e filtros
│   │   │   │   ├── AnalysisHeader.jsx
│   │   │   │   ├── FilterIndicators.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   └── InsightsSection.jsx
│   │   │   │
│   │   │   ├── chatbot/             # Interface do chatbot
│   │   │   │   ├── ChatArea.jsx
│   │   │   │   ├── ChatFooter.jsx
│   │   │   │   ├── ChatHeader.jsx
│   │   │   │   ├── DesktopSidebar.jsx
│   │   │   │   ├── MobileFAB.jsx
│   │   │   │   └── ParticlesBackground.jsx
│   │   │   │
│   │   │   ├── dashboard/           # Dashboard principal
│   │   │   │   ├── AlertsPanel.jsx
│   │   │   │   ├── CrimeHeatmap.jsx
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── DashboardLoadingError.jsx
│   │   │   │   ├── DashboardStats.jsx
│   │   │   │   ├── InteractiveChart.jsx
│   │   │   │   ├── RaceChart.jsx
│   │   │   │   ├── TimelineChart.jsx
│   │   │   │   └── TopMunicipios.jsx
│   │   │   │
│   │   │   ├── data-info/           # Informações sobre dados
│   │   │   │   ├── AtualizacoesTab.jsx
│   │   │   │   ├── DataInfoHeader.jsx
│   │   │   │   ├── FontesTab.jsx
│   │   │   │   ├── MetodologiaTab.jsx
│   │   │   │   ├── NavigationTabs.jsx
│   │   │   │   └── PrivacidadeTab.jsx
│   │   │   │
│   │   │   ├── data-insert/         # Inserção de dados
│   │   │   │   ├── DataInsertHeader.jsx
│   │   │   │   ├── FieldRenderer.jsx
│   │   │   │   ├── InsertionForm.jsx
│   │   │   │   ├── RecentInsertions.jsx
│   │   │   │   ├── StepIndicator.jsx
│   │   │   │   ├── StepNavigation.jsx
│   │   │   │   └── TableSelectionGrid.jsx
│   │   │   │
│   │   │   ├── map/                 # Visualização de mapas
│   │   │   │   ├── BarChart.jsx
│   │   │   │   ├── DonutChart.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── InteractiveMap.jsx
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── SimpleFilters.jsx
│   │   │   │   └── ViewModeSelector.jsx
│   │   │   │
│   │   │   ├── profile/             # Perfil do usuário
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── ProfileHeader.jsx
│   │   │   │   └── ProfileSidebar.jsx
│   │   │   │
│   │   │   └── risk-profile/        # Perfil de risco
│   │   │       ├── RiskForm.jsx
│   │   │       ├── RiskHeader.jsx
│   │   │       ├── RiskHistory.jsx
│   │   │       └── RiskResult.jsx
│   │   │
│   │   ├── shared/                  # Componentes compartilhados
│   │   │   │
│   │   │   ├── charts/              # Gráficos reutilizáveis
│   │   │   │   ├── AdvancedChart.jsx
│   │   │   │   ├── ComparisonChart.jsx
│   │   │   │   ├── CorrelationMatrix.jsx
│   │   │   │   ├── PredictionChart.jsx
│   │   │   │   ├── RaceBar.jsx
│   │   │   │   ├── RaceHeader.jsx
│   │   │   │   └── RaceProgress.jsx
│   │   │   │
│   │   │   ├── forms/               # Formulários compartilhados
│   │   │   │   ├── AuthModal.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── OTPForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── SuccessForm.jsx
│   │   │   │
│   │   │   └── stats/               # Estatísticas
│   │   │       └── StatsCard.jsx
│   │   │
│   │   └── ui/                      # Componentes base (Design System)
│   │       ├── accordion.jsx        # Acordeão Radix UI
│   │       ├── alert.jsx            # Alertas
│   │       ├── button.jsx           # Botões
│   │       ├── card.jsx             # Cards
│   │       ├── error-boundary.jsx   # Tratamento de erros
│   │       ├── label.jsx            # Labels
│   │       ├── loading.jsx          # Estados de loading
│   │       ├── radio-group.jsx      # Radio buttons
│   │       ├── select.jsx           # Selects
│   │       ├── ThemeToggle.jsx      # Toggle dark/light mode
│   │       └── toast.jsx            # Notificações toast
│   │
│   ├── constants/                   # Constantes e configurações
│   │   ├── dataInsertConfig.js      # Config de inserção de dados
│   │   ├── filter_options.js        # Opções de filtros
│   │   ├── municipiosCE.js          # Lista de municípios do CE
│   │   └── temas.jsx                # Temas do sistema
│   │
│   ├── contexts/                    # Context API do React
│   │   ├── AuthContext.jsx          # Contexto de autenticação
│   │   └── ThemeContext.jsx         # Contexto de tema
│   │
│   ├── hooks/                       # Custom Hooks organizados
│   │   │
│   │   ├── pages/                   # Hooks específicos de páginas
│   │   │   ├── useAccountsManagement.js
│   │   │   ├── useAnalysisFilters.js
│   │   │   ├── useChatbot.js
│   │   │   ├── useDashboardData.js
│   │   │   ├── useMapData.js
│   │   │   ├── useProfile.js
│   │   │   └── useRiskCalculator.js
│   │   │
│   │   ├── shared/                  # Hooks compartilhados
│   │   │   ├── useCrimeData.js
│   │   │   ├── useLayout.js
│   │   │   ├── useRaceData.js
│   │   │   └── useRaceRankingData.js
│   │   │
│   │   └── ui/                      # Hooks de UI
│   │       ├── use-mobile.jsx
│   │       ├── use-toast.js
│   │       ├── useAuthModal.js
│   │       └── useRaceAnimation.js
│   │
│   ├── images/                      # Imagens e assets
│   │   ├── brasao_ce.png
│   │   └── brasao_ce.svg
│   │
│   ├── lib/                         # Bibliotecas e utilitários
│   │   └── utils.js                 # Funções utilitárias (cn, etc)
│   │
│   ├── pages/                       # Páginas principais da aplicação
│   │   ├── AccountsManagement.jsx   # Gerenciamento de contas
│   │   ├── Analises.jsx             # Página de análises
│   │   ├── Chatbot.jsx              # Página do chatbot
│   │   ├── Dashboard.jsx            # Dashboard principal
│   │   ├── DataInsert.jsx           # Inserção de dados
│   │   ├── Map.jsx                  # Visualização de mapas
│   │   ├── PerfilRisco.jsx          # Perfil de risco
│   │   ├── Profile.jsx              # Perfil do usuário
│   │   └── SobreDados.jsx           # Sobre os dados
│   │
│   ├── scripts/                     # Scripts auxiliares
│   │   ├── news-scheduler.js        # Agendador de notícias
│   │   ├── scrape-sspds.js          # Web scraping SSPDS
│   │   └── start-scraper.js         # Inicializador do scraper
│   │
│   ├── services/                    # Serviços de API organizados
│   │   │
│   │   ├── auth/                    # Serviços de autenticação
│   │   │   ├── authService.js
│   │   │   └── otpService.js
│   │   │
│   │   ├── crimes/                  # Serviços de crimes
│   │   │   ├── armaFogoService.js
│   │   │   ├── cvliService.js
│   │   │   ├── furtoService.js
│   │   │   └── leiMariaPenhaService.js
│   │   │
│   │   ├── AiService.jsx            # Serviço de IA
│   │   ├── analisesService.js       # Serviço de análises
│   │   ├── crimeService.js          # Serviço geral de crimes
│   │   ├── dashboardService.js      # Serviço do dashboard
│   │   ├── dataInsertService.js     # Serviço de inserção
│   │   ├── ibgeService.js           # Integração IBGE
│   │   ├── mapaService.js           # Serviço de mapas
│   │   ├── pdfService.js            # Geração de PDFs
│   │   ├── pdfServiceIntegrado.js   # PDF integrado
│   │   ├── riskService.js           # Cálculo de risco
│   │   └── usuarioService.js        # Serviço de usuários
│   │
│   ├── utils/                       # Utilitários específicos
│   │   ├── municipioUtils.js        # Utilitários de municípios
│   │   └── proportionalUtils.js     # Cálculos proporcionais
│   │
│   ├── App.jsx                      # Componente raiz da aplicação
│   ├── index.css                    # Estilos globais e variáveis CSS
│   ├── layout.jsx                   # Layout principal
│   └── main.jsx                     # Entry point do React
│
├── .dockerignore                    # Arquivos ignorados no Docker
├── .env                             # Variáveis de ambiente
├── .env.example                     # Exemplo de variáveis
├── .gitignore                       # Arquivos ignorados no Git
├── Dockerfile                       # Configuração Docker
├── index.html                       # HTML base
├── package.json                     # Dependências e scripts
├── package-lock.json                # Lock de dependências
├── postcss.config.js                # Configuração PostCSS
├── README.md                        # Documentação
├── tailwind.config.js               # Configuração Tailwind
└── vite.config.js                   # Configuração Vite
```

---

## 🏗️ METODOLOGIA E PADRÕES ARQUITETURAIS

### 1. **ARQUITETURA DE COMPONENTES**

#### **Atomic Design Adaptado**
- **ui/**: Componentes atômicos (botões, inputs, cards)
- **shared/**: Componentes moleculares (formulários, gráficos)
- **pages/**: Componentes de página específicos
- **layout/**: Componentes de estrutura global

#### **Separação de Responsabilidades**
- **Componentes**: Apenas UI e apresentação
- **Hooks**: Lógica de negócio e estado
- **Services**: Comunicação com APIs
- **Utils**: Funções auxiliares puras

---

### 2. **ORGANIZAÇÃO DE CÓDIGO**

#### **Padrão de Nomenclatura**
```
- PascalCase: Componentes React (Button.jsx, UserProfile.jsx)
- camelCase: Funções, hooks, services (useAuth.js, authService.js)
- kebab-case: Arquivos CSS e config (index.css, vite.config.js)
- UPPER_CASE: Constantes (API_URL, MAX_RETRIES)
```

#### **Estrutura de Arquivo de Componente**
```jsx
// 1. Imports externos
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports internos
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 3. Imports de tipos/constantes
import { ROUTES } from '@/constants/routes';

// 4. Componente
export const MyComponent = ({ prop1, prop2 }) => {
  // 4.1 Hooks
  const [state, setState] = useState();
  const navigate = useNavigate();
  
  // 4.2 Efeitos
  useEffect(() => {
    // lógica
  }, []);
  
  // 4.3 Handlers
  const handleClick = () => {
    // lógica
  };
  
  // 4.4 Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

---

### 3. **GERENCIAMENTO DE ESTADO**

#### **Níveis de Estado**
```
1. Local State (useState): Estado de componente único
2. Context API: Estado compartilhado (Auth, Theme)
3. Custom Hooks: Lógica reutilizável com estado
4. TanStack Query: Cache de dados de API
```

#### **Exemplo de Context**
```jsx
// contexts/AuthContext.jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 4. **COMUNICAÇÃO COM API**

#### **Estrutura de Service**
```javascript
// services/auth/authService.js
import api from '@/api/api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};
```

#### **Configuração Axios**
```javascript
// api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### 5. **CUSTOM HOOKS**

#### **Organização por Escopo**
```
hooks/
├── pages/          # Hooks específicos de páginas
├── shared/         # Hooks compartilhados entre páginas
└── ui/             # Hooks de interface/interação
```

#### **Exemplo de Hook**
```javascript
// hooks/pages/useDashboardData.js
export const useDashboardData = (filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, [filters]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getData(filters);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch: fetchData };
};
```

---

### 6. **ROTEAMENTO**

#### **Estrutura de Rotas**
```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RotaProtegida } from '@/auth/RotaProtegida';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route element={<RotaProtegida />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 7. **ESTILIZAÇÃO COM TAILWIND**

#### **Sistema de Design**
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        ceara: {
          blue: { 500: '#0066CC', 950: '#003366' },
          green: { 500: '#00A651' },
          orange: { 500: '#FF6B35' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out'
      }
    }
  }
};
```

#### **Utilitário cn() para Classes Condicionais**
```javascript
// lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Uso:
<Button className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)} />
```

---

### 8. **OTIMIZAÇÃO E PERFORMANCE**

#### **Code Splitting**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot'],
          charts: ['react-chartjs-2', 'chart.js'],
          maps: ['react-leaflet', 'leaflet']
        }
      }
    }
  }
};
```

#### **Lazy Loading de Rotas**
```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

### 9. **TRATAMENTO DE ERROS**

#### **Error Boundary**
```jsx
// components/ui/error-boundary.jsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

### 10. **CONSTANTES E CONFIGURAÇÕES**

#### **Organização de Constantes**
```javascript
// constants/filter_options.js
export const CRIME_TYPES = {
  CVLI: 'cvli',
  FURTO: 'furto',
  ARMA_FOGO: 'arma_fogo',
  LEI_MARIA_PENHA: 'lei_maria_penha'
};

export const FILTER_OPTIONS = {
  years: [2020, 2021, 2022, 2023, 2024],
  months: ['Janeiro', 'Fevereiro', 'Março', ...]
};
```

---

## 🔧 CONFIGURAÇÕES PRINCIPAIS

### **package.json - Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "scrape-news": "node src/scripts/start-scraper.js"
  }
}
```

### **vite.config.js - Alias e Otimizações**
```javascript
export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
};
```

### **.env - Variáveis de Ambiente**
```
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_AI_KEY=your_key_here
VITE_MAPBOX_TOKEN=your_token_here
```

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### **Core**
- `react` + `react-dom`: Framework
- `vite`: Build tool
- `react-router-dom`: Roteamento

### **UI/UX**
- `@radix-ui/*`: Componentes acessíveis
- `tailwindcss`: Estilização
- `framer-motion`: Animações
- `lucide-react`: Ícones

### **Dados e Estado**
- `@tanstack/react-query`: Cache de API
- `axios`: HTTP client
- `react-hook-form`: Formulários

### **Visualização**
- `recharts`: Gráficos
- `react-leaflet`: Mapas
- `chart.js`: Gráficos avançados

---

## 🎯 BOAS PRÁTICAS APLICADAS

1. **Componentização**: Componentes pequenos e reutilizáveis
2. **Single Responsibility**: Cada arquivo tem uma responsabilidade
3. **DRY**: Não repetir código (hooks e utils)
4. **Separation of Concerns**: UI separada de lógica
5. **Naming Conventions**: Nomenclatura consistente
6. **File Organization**: Estrutura lógica e escalável
7. **Performance**: Lazy loading e code splitting
8. **Accessibility**: Componentes acessíveis (Radix UI)
9. **Error Handling**: Tratamento robusto de erros
10. **Type Safety**: Validação com Zod

---

## 🚀 COMO APLICAR EM OUTRO PROJETO

### **Passo 1: Estrutura Base**
```bash
mkdir -p src/{api,auth,components/{ui,shared,layout,pages},constants,contexts,hooks/{pages,shared,ui},images,lib,pages,scripts,services,utils}
```

### **Passo 2: Configurações**
1. Copiar `vite.config.js`
2. Copiar `tailwind.config.js`
3. Copiar `postcss.config.js`
4. Criar `.env` baseado em `.env.example`

### **Passo 3: Dependências**
```bash
npm install react react-dom react-router-dom
npm install @tanstack/react-query axios
npm install tailwindcss @radix-ui/react-slot lucide-react
npm install framer-motion clsx tailwind-merge
```

### **Passo 4: Arquivos Base**
1. Criar `src/api/api.js` (configuração Axios)
2. Criar `src/lib/utils.js` (função cn)
3. Criar `src/App.jsx` (rotas)
4. Criar `src/main.jsx` (entry point)

### **Passo 5: Componentes UI**
1. Copiar pasta `src/components/ui/`
2. Adaptar cores e estilos no Tailwind

### **Passo 6: Estrutura de Páginas**
1. Criar páginas em `src/pages/`
2. Criar componentes específicos em `src/components/pages/`
3. Criar hooks em `src/hooks/pages/`
4. Criar services em `src/services/`

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Estrutura de pastas criada
- [ ] Configurações (Vite, Tailwind, PostCSS)
- [ ] Dependências instaladas
- [ ] API configurada (Axios)
- [ ] Roteamento configurado
- [ ] Componentes UI base criados
- [ ] Contexts (Auth, Theme) implementados
- [ ] Error Boundary implementado
- [ ] Loading states implementados
- [ ] Variáveis de ambiente configuradas

---

**Este documento serve como guia completo para replicar a estrutura do FrontEnd Segura-CE em qualquer projeto React moderno.**