import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBarr";
import { ArrowLeft, UserPlus, Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import FormPacient from "./FormPacient";

export default function NewClient() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧾 Estado inicial dos dados do cliente
  const [patientData, setPatientData] = useState({
    // Dados Pessoais
    nome: "",
    cpf: "",
    nascimento: "",
    genero: "",
    generoOutro: "",
    telefone: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",

    // Dados de Saúde
    condicoesCronicas: [],
    alergias: "",
    medicamentosUso: "",
    cirurgiasAnteriores: "",
    fumante: "",
    consumoAlcool: "",
    atividadeFisica: "",
    exFumante: "",
    
    // Condições Especiais
    gestante: false,
    lactante: false,
    idoso: false,
    crianca: false,

    // LGPD
    consentimentoLGPD: false,
    consentimentoComunicacoes: false,
  });

  const [errors, setErrors] = useState({});

  // 🖋️ Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Formatação automática do CPF
    if (name === "cpf") {
      const formattedCPF = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
      
      setPatientData((prev) => ({
        ...prev,
        [name]: formattedCPF,
      }));
      return;
    }

    // Formatação automática do telefone
    if (name === "telefone") {
      const formattedPhone = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
      
      setPatientData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
      return;
    }

    // Formatação automática do CEP
    if (name === "cep") {
      const formattedCEP = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);
      
      setPatientData((prev) => ({
        ...prev,
        [name]: formattedCEP,
      }));

      // Busca automática do CEP quando completo
      if (formattedCEP.length === 9) {
        handleCEPSearch(formattedCEP);
      }
      return;
    }

    setPatientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔍 Busca automática de CEP
  const handleCEPSearch = async (cep) => {
    try {
      const cleanCEP = cep.replace(/\D/g, "");
      if (cleanCEP.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setPatientData(prev => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // ➡️ Avançar para próxima etapa
  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  // ⬅️ Voltar para etapa anterior
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // ✅ Validação da etapa 1 (Dados Pessoais)
  const validateStep1 = () => {
    const newErrors = {};

    if (!patientData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!patientData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    if (!patientData.nascimento) newErrors.nascimento = "Data de nascimento é obrigatória";
    if (!patientData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!patientData.cep.trim()) newErrors.cep = "CEP é obrigatório";
    if (!patientData.endereco.trim()) newErrors.endereco = "Endereço é obrigatório";
    if (!patientData.numero.trim()) newErrors.numero = "Número é obrigatório";
    if (!patientData.cidade.trim()) newErrors.cidade = "Cidade é obrigatória";
    if (!patientData.estado.trim()) newErrors.estado = "Estado é obrigatório";

    // Validação de formato
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (patientData.cpf && !cpfRegex.test(patientData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (patientData.email && !emailRegex.test(patientData.email)) {
      newErrors.email = "E-mail inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Validação da etapa 3 (LGPD)
  const validateStep3 = () => {
    if (!patientData.consentimentoLGPD) {
      setErrors({ consentimentoLGPD: "É necessário aceitar os termos da LGPD" });
      return false;
    }
    return true;
  };

  // 💾 Função de salvar final
  const handleSalvar = async () => {
    setIsSubmitting(true);

    try {
      // Simulação de chamada API
      console.log("✅ Dados do novo cliente:", patientData);
      
      // Aqui você integraria com sua API
      // await savePatient(patientData);
      
      alert("Cliente cadastrado com sucesso!");
      navigate("/clientes");
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert("Erro ao cadastrar cliente. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔄 Limpar formulário
  const handleCancelar = () => {
    if (window.confirm("Tem certeza que deseja cancelar? Todos os dados serão perdidos.")) {
      navigate("/clientes");
    }
  };

  // 🎯 Manipulação de condições crônicas (checkbox múltiplo)
  const handleCondicoesChange = (condicao) => {
    setPatientData(prev => {
      const novasCondicoes = prev.condicoesCronicas.includes(condicao)
        ? prev.condicoesCronicas.filter(c => c !== condicao)
        : [...prev.condicoesCronicas, condicao];
      
      return {
        ...prev,
        condicoesCronicas: novasCondicoes
      };
    });
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.background }}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* 🔹 Navbar */}
        <div className="h-20 shadow flex items-center justify-between px-6 sticky top-0 z-10" style={{ backgroundColor: theme.primary }}>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelar}
              className="text-white hover:scale-110 transition transform"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus size={26} />
              Novo Cliente
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="text-white text-sm">
              Etapa {currentStep} de 4
            </div>
          </div>
        </div>

        {/* 🔹 Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          <FormPacient
            currentStep={currentStep}
            patientData={patientData}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onCondicoesChange={handleCondicoesChange}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancelar}
            onSave={handleSalvar}
          />
        </div>
      </div>
    </div>
  );
}