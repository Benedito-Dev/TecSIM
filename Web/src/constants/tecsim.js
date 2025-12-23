// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  DASHBOARD: '/dashboard',
  DASHBOARD_GERAL: '/dashboard-geral',
  MEDICAMENTOS: '/medicamentos',
  PERFIL: '/perfil',
  PERFIL_EDITAR: '/perfil/editar',
  LEMBRETES: '/lembretes',
  PRESCRICOES: '/prescricoes',
  AJUSTES: '/ajustes',
  CHAT: '/chatbot',
  ATENDIMENTO: '/atendimento',
  CLIENTES: '/clientes',
  NOVO_CLIENTE: '/novocliente',
  FORM_PACIENTE: '/formpacient'
};

// Tipos de usuário
export const USER_TYPES = {
  ENFERMEIRO: 'enfermeiro',
  CUIDADOR: 'cuidador',
  ESTUDANTE: 'estudante'
};

// Status de medicamentos
export const MEDICINE_STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  SUSPENSO: 'suspenso'
};

// Níveis de urgência
export const URGENCY_LEVELS = {
  BAIXA: 'baixa',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica'
};

// Cores do tema TecSim
export const TECSIM_COLORS = {
  primary: '#0066CC',
  secondary: '#00A651',
  accent: '#FF6B35',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};