import React from 'react';
import { CheckCircle, UserPlus, Heart } from 'lucide-react';
import { FormSection } from '../../shared/forms';
import { useTheme } from '../../../context/ThemeContext';

const InfoField = ({ label, value }) => {
  const { theme } = useTheme();
  return (
    <div>
      <span 
        className="text-sm block mb-1"
        style={{ color: theme.textSecondary }}
      >
        {label}
      </span>
      <span 
        className="font-medium block"
        style={{ color: theme.textPrimary }}
      >
        {value || "Não informado"}
      </span>
    </div>
  );
};

const Step4 = ({ patientData }) => {
  const getGeneroDisplay = () => {
    const generoMap = {
      "mulher_cis": "Mulher cis",
      "homem_cis": "Homem cis",
      "mulher_trans": "Mulher trans",
      "homem_trans": "Homem trans",
      "outro": patientData.generoOutro || "Outro",
      "prefere_nao_responder": "Prefere não responder"
    };
    return generoMap[patientData.genero] || "Não informado";
  };

  return (
    <FormSection title="Confirmação" subtitle="Revise os dados antes de finalizar">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="font-semibold text-green-800 text-lg">Dados preenchidos com sucesso!</h3>
          </div>
          <p className="text-green-700 mt-2">
            Revise todas as informações abaixo antes de finalizar o cadastro.
          </p>
        </div>

        <div className="space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <UserPlus size={20} />
              Dados Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="CPF" value={patientData.cpf} />
              <InfoField label="Nome Completo" value={patientData.nome} />
              <InfoField label="Data de Nascimento" value={patientData.nascimento} />
              <InfoField label="Telefone" value={patientData.telefone} />
              <InfoField label="E-mail" value={patientData.email} />
              <InfoField label="Gênero" value={getGeneroDisplay()} />
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">Endereço</h4>
            <div className="space-y-2">
              <InfoField label="Endereço" value={`${patientData.endereco}, ${patientData.numero}${patientData.complemento ? ` - ${patientData.complemento}` : ''}`} />
              <InfoField label="Bairro" value={patientData.bairro} />
              <InfoField label="Cidade/Estado" value={`${patientData.cidade} / ${patientData.estado}`} />
              <InfoField label="CEP" value={patientData.cep} />
            </div>
          </div>

          {/* Dados de Saúde */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <Heart size={20} />
              Dados de Saúde
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField 
                label="Condições Crônicas" 
                value={patientData.condicoesCronicas.length > 0 ? patientData.condicoesCronicas.join(', ') : 'Nenhuma'} 
              />
              <InfoField label="Alergias" value={patientData.alergias || 'Nenhuma'} />
              <InfoField label="Medicamentos em Uso" value={patientData.medicamentosUso || 'Nenhum'} />
              <InfoField label="Cirurgias Anteriores" value={patientData.cirurgiasAnteriores || 'Nenhuma'} />
              
              {/* Condições Especiais */}
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500 block mb-2">Condições Especiais</span>
                <div className="flex flex-wrap gap-2">
                  {patientData.gestante && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Gestante</span>}
                  {patientData.lactante && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Lactante</span>}
                  {patientData.idoso && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Idoso</span>}
                  {patientData.crianca && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Criança</span>}
                  {!patientData.gestante && !patientData.lactante && !patientData.idoso && !patientData.crianca && 
                    <span className="text-gray-500">Nenhuma condição especial</span>
                  }
                </div>
              </div>

              {/* Hábitos */}
              <InfoField label="Fumante" value={
                patientData.fumante === "nao" ? "Não" :
                patientData.fumante === "ocasional" ? "Ocasional" :
                patientData.fumante === "regular" ? "Regular" : "Não informado"
              } />
              <InfoField label="Consumo de Álcool" value={
                patientData.consumoAlcool === "nao" ? "Não" :
                patientData.consumoAlcool === "social" ? "Social" :
                patientData.consumoAlcool === "regular" ? "Regular" : "Não informado"
              } />
              <InfoField label="Atividade Física" value={
                patientData.atividadeFisica === "sedentario" ? "Sedentário" :
                patientData.atividadeFisica === "leve" ? "Leve" :
                patientData.atividadeFisica === "regular" ? "Regular" :
                patientData.atividadeFisica === "intenso" ? "Intenso" : "Não informado"
              } />
              <InfoField label="Ex-fumante" value={
                patientData.exFumante === "nao" ? "Não" :
                patientData.exFumante === "sim_menos_1ano" ? "Sim (menos de 1 ano)" :
                patientData.exFumante === "sim_1a5anos" ? "Sim (1-5 anos)" :
                patientData.exFumante === "sim_mais_5anos" ? "Sim (mais de 5 anos)" : "Não informado"
              } />
            </div>
          </div>

          {/* LGPD */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">Consentimentos</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${patientData.consentimentoLGPD ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={patientData.consentimentoLGPD ? 'text-green-700 font-medium' : 'text-red-700'}>
                  {patientData.consentimentoLGPD ? 'Aceita termos da LGPD' : 'Não aceita termos da LGPD'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${patientData.consentimentoComunicacoes ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={patientData.consentimentoComunicacoes ? 'text-green-700 font-medium' : 'text-red-700'}>
                  {patientData.consentimentoComunicacoes ? 'Aceita receber comunicações' : 'Não aceita receber comunicações'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Step4;