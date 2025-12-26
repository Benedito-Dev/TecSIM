import React from 'react';
import { FormSection, InputField, SelectField } from '../../shared/forms';

const Step1 = ({ patientData, errors, onChange }) => {
  const estadosOptions = [
    { value: "", label: "Selecione" },
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" }
  ];

  const generoOptions = [
    { value: "mulher_cis", label: "Mulher cis" },
    { value: "homem_cis", label: "Homem cis" },
    { value: "mulher_trans", label: "Mulher trans" },
    { value: "homem_trans", label: "Homem trans" },
    { value: "outro", label: "Outro" },
    { value: "prefere_nao_responder", label: "Prefere não responder" }
  ];

  return (
    <FormSection title="Dados Pessoais" subtitle="Informações básicas do cliente">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="CPF *"
          name="cpf"
          value={patientData.cpf}
          onChange={onChange}
          placeholder="000.000.000-00"
          error={errors.cpf}
          required
        />
        <InputField
          label="Nome Completo *"
          name="nome"
          value={patientData.nome}
          onChange={onChange}
          placeholder="Digite o nome completo"
          error={errors.nome}
          required
        />
        <InputField
          label="Data de Nascimento *"
          type="date"
          name="nascimento"
          value={patientData.nascimento}
          onChange={onChange}
          error={errors.nascimento}
          required
        />
        <InputField
          label="Telefone *"
          name="telefone"
          value={patientData.telefone}
          onChange={onChange}
          placeholder="(00) 00000-0000"
          error={errors.telefone}
          required
        />
        
        {/* Campo de Gênero */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gênero
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generoOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="genero"
                  value={option.value}
                  checked={patientData.genero === option.value}
                  onChange={onChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          
          {/* Campo para especificar "Outro" */}
          {patientData.genero === "outro" && (
            <div className="mt-3">
              <InputField
                label="Especifique seu gênero"
                name="generoOutro"
                value={patientData.generoOutro}
                onChange={onChange}
                placeholder="Descreva seu gênero..."
              />
            </div>
          )}
        </div>

        <InputField
          label="Endereço *"
          name="endereco"
          value={patientData.endereco}
          onChange={onChange}
          placeholder="Rua, número, complemento"
          error={errors.endereco}
          required
        />
        <InputField
          label="Número *"
          name="numero"
          value={patientData.numero}
          onChange={onChange}
          placeholder="Número"
          error={errors.numero}
          required
        />
        <InputField
          label="Complemento"
          name="complemento"
          value={patientData.complemento}
          onChange={onChange}
          placeholder="Complemento"
        />
        <InputField
          label="Cidade *"
          name="cidade"
          value={patientData.cidade}
          onChange={onChange}
          placeholder="Cidade"
          error={errors.cidade}
          required
        />
        <InputField
          label="CEP *"
          name="cep"
          value={patientData.cep}
          onChange={onChange}
          placeholder="00000-000"
          error={errors.cep}
          required
        />
        <InputField
          label="E-mail"
          type="email"
          name="email"
          value={patientData.email}
          onChange={onChange}
          placeholder="cliente@email.com"
          error={errors.email}
        />
        <SelectField
          label="Estado *"
          name="estado"
          value={patientData.estado}
          onChange={onChange}
          error={errors.estado}
          options={estadosOptions}
          required
        />
      </div>
    </FormSection>
  );
};

export default Step1;