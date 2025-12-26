import React from 'react';
import { FormSection } from '../../shared/forms';

const Step3 = ({ patientData, errors, onChange }) => {
  return (
    <FormSection title="Termo LGPD" subtitle="Consentimento de uso de dados">
      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-4 text-lg">Lei Geral de Proteção de Dados (LGPD)</h3>
          
          <div className="space-y-4 text-blue-700 text-sm leading-relaxed">
            <p>
              De acordo com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais), 
              solicitamos seu consentimento para o tratamento dos seus dados pessoais para as seguintes finalidades:
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cadastro e identificação no sistema da farmácia</li>
              <li>Controle de medicamentos e prescrições</li>
              <li>Comunicação sobre serviços de saúde</li>
              <li>Emissão de recibos e documentos fiscais</li>
              <li>Contato para informações sobre medicamentos</li>
              <li>Histórico de compras e tratamentos</li>
            </ul>
            
            <p>
              Seus dados serão mantidos em sigilo e utilizados apenas para os fins autorizados. 
              Você pode revogar este consentimento a qualquer momento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-6 bg-white border border-gray-200 rounded-xl">
            <input
              type="checkbox"
              name="consentimentoLGPD"
              checked={patientData.consentimentoLGPD}
              onChange={onChange}
              className="w-5 h-5 mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-gray-700 font-medium block mb-2">
                Aceito os termos da LGPD
              </span>
              <p className="text-gray-600 text-sm">
                Declaro que li e compreendi as informações acima e autorizo o tratamento 
                dos meus dados pessoais para as finalidades descritas.
              </p>
              {errors.consentimentoLGPD && (
                <span className="text-red-600 text-sm mt-2 block">{errors.consentimentoLGPD}</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-6 bg-white border border-gray-200 rounded-xl">
            <input
              type="checkbox"
              name="consentimentoComunicacoes"
              checked={patientData.consentimentoComunicacoes}
              onChange={onChange}
              className="w-5 h-5 mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-gray-700 font-medium block mb-2">
                Aceito receber comunicações
              </span>
              <p className="text-gray-600 text-sm">
                Autorizo o envio de comunicações sobre medicamentos, promoções e serviços de saúde 
                por e-mail, SMS ou WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Step3;