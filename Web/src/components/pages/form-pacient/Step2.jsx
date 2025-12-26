import React from 'react';
import { FormSection, TextAreaField, RadioGroup } from '../../shared/forms';

const Step2 = ({ patientData, errors, onChange, onCondicoesChange }) => {
  const condicoesCronicas = [
    "Hipertensão", "Diabetes Tipo 1", "Diabetes Tipo 2",
    "Asma", "DPOC", "Doença Cardíaca",
    "Colesterol Alto", "Osteoporose", "Artrite",
    "Depressão", "Ansiedade", "Obesidade"
  ];

  const condicoesEspeciais = [
    { name: "gestante", label: "Gestante" },
    { name: "lactante", label: "Lactante" },
    { name: "idoso", label: "Idoso" },
    { name: "crianca", label: "Criança" }
  ];

  return (
    <FormSection title="Dados de Saúde" subtitle="Histórico médico e condições de saúde">
      <div className="space-y-6">
        {/* Condições Crônicas */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Condições Crônicas</h3>
          <p className="text-gray-600 mb-4 text-sm">Selecione todas as condições aplicáveis</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {condicoesCronicas.map((condicao) => (
              <label key={condicao} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patientData.condicoesCronicas.includes(condicao)}
                  onChange={() => onCondicoesChange(condicao)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{condicao}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condições Especiais */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Condições Especiais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {condicoesEspeciais.map((condicao) => (
              <label key={condicao.name} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name={condicao.name}
                  checked={patientData[condicao.name]}
                  onChange={onChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{condicao.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Alergias */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Alergias</h3>
          <p className="text-gray-600 mb-4 text-sm">Liste medicamentos, alimentos ou outras substâncias que causam alergias...</p>
          <TextAreaField
            name="alergias"
            value={patientData.alergias}
            onChange={onChange}
            placeholder="Ex: Penicilina, Dipirona, Amoxicilina..."
            rows={3}
          />
        </div>

        {/* Medicamentos em Uso */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Medicamentos em Uso</h3>
          <p className="text-gray-600 mb-4 text-sm">Liste todos os medicamentos que o cliente usa regularmente...</p>
          <TextAreaField
            name="medicamentosUso"
            value={patientData.medicamentosUso}
            onChange={onChange}
            placeholder="Ex: Losartana 50mg, Metformina 850mg, AAS 100mg..."
            rows={3}
          />
        </div>

        {/* Cirurgias Anteriores */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Cirurgias Anteriores</h3>
          <p className="text-gray-600 mb-4 text-sm">Liste cirurgias realizadas e datas aproximadas...</p>
          <TextAreaField
            name="cirurgiasAnteriores"
            value={patientData.cirurgiasAnteriores}
            onChange={onChange}
            placeholder="Ex: Apendicectomia (2018), Colecistectomia (2020)..."
            rows={3}
          />
        </div>

        {/* Hábitos */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Hábitos de Vida</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RadioGroup
              label="Fumante?"
              name="fumante"
              value={patientData.fumante}
              onChange={onChange}
              options={[
                { value: "nao", label: "Não" },
                { value: "ocasional", label: "Ocasional" },
                { value: "regular", label: "Regular" }
              ]}
            />
            <RadioGroup
              label="Consumo de Álcool"
              name="consumoAlcool"
              value={patientData.consumoAlcool}
              onChange={onChange}
              options={[
                { value: "nao", label: "Não" },
                { value: "social", label: "Social" },
                { value: "regular", label: "Regular" }
              ]}
            />
            <RadioGroup
              label="Atividade Física"
              name="atividadeFisica"
              value={patientData.atividadeFisica}
              onChange={onChange}
              options={[
                { value: "sedentario", label: "Sedentário" },
                { value: "leve", label: "Leve" },
                { value: "regular", label: "Regular" },
                { value: "intenso", label: "Intenso" }
              ]}
            />
          </div>
          
          <div className="mt-6">
            <RadioGroup
              label="Ex-fumante?"
              name="exFumante"
              value={patientData.exFumante}
              onChange={onChange}
              options={[
                { value: "nao", label: "Não" },
                { value: "sim_menos_1ano", label: "Sim (menos de 1 ano)" },
                { value: "sim_1a5anos", label: "Sim (1-5 anos)" },
                { value: "sim_mais_5anos", label: "Sim (mais de 5 anos)" }
              ]}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Step2;