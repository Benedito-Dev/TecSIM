import React from "react";
import { FileText, CheckCircle, UserPlus, Heart } from "lucide-react";

const FormPacient = ({
  currentStep,
  patientData,
  errors,
  isSubmitting,
  onChange,
  onCondicoesChange,
  onNext,
  onBack,
  onCancel,
  onSave
}) => {
  // 🎯 Componente de Progresso
  const StepProgress = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step 
                ? "bg-blue-600 border-blue-600 text-white" 
                : "border-gray-300 text-gray-500"
            } font-semibold`}>
              {currentStep > step ? <CheckCircle size={20} /> : step}
            </div>
            <div className="ml-3">
              <div className={`text-sm font-medium ${
                currentStep >= step ? "text-blue-600" : "text-gray-500"
              }`}>
                {step === 1 && "Dados Pessoais"}
                {step === 2 && "Dados de Saúde"}
                {step === 3 && "Termo LGPD"}
                {step === 4 && "Confirmação"}
              </div>
            </div>
            {step < 4 && (
              <div className={`w-12 h-0.5 mx-4 ${
                currentStep > step ? "bg-blue-600" : "bg-gray-300"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 📋 Etapa 1: Dados Pessoais
  const Step1 = () => (
    <Section title="Dados Pessoais" subtitle="Informações básicas do cliente">
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
        
        {/* Campo de Gênero Atualizado */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gênero
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: "mulher_cis", label: "Mulher cis" },
              { value: "homem_cis", label: "Homem cis" },
              { value: "mulher_trans", label: "Mulher trans" },
              { value: "homem_trans", label: "Homem trans" },
              { value: "pessoa_nao_binaria", label: "Pessoa não binária" },
              { value: "genero_fluid", label: "Gênero fluid" },
              { value: "outro", label: "Outro" },
              { value: "prefere_nao_responder", label: "Prefere não responder" }
            ].map((option) => (
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
          options={[
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
          ]}
          required
        />
      </div>
    </Section>
  );

  // 📋 Etapa 2: Dados de Saúde
  const Step2 = () => (
    <Section title="Dados de Saúde" subtitle="Histórico médico e condições de saúde">
      <div className="space-y-6">
        {/* Condições Crônicas */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Condições Crônicas</h3>
          <p className="text-gray-600 mb-4 text-sm">Selecione todas as condições aplicáveis</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Hipertensão", "Diabetes Tipo 1", "Diabetes Tipo 2",
              "Asma", "DPOC", "Doença Cardíaca",
              "Colesterol Alto", "Osteoporose", "Artrite",
              "Depressão", "Ansiedade", "Obesidade"
            ].map((condicao) => (
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
            {[
              { name: "gestante", label: "Gestante" },
              { name: "lactante", label: "Lactante" },
              { name: "idoso", label: "Idoso" },
              { name: "crianca", label: "Criança" }
            ].map((condicao) => (
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
    </Section>
  );

  // 📋 Etapa 3: Termo LGPD
  const Step3 = () => (
    <Section title="Termo LGPD" subtitle="Consentimento de uso de dados">
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
    </Section>
  );

  // 📋 Etapa 4: Confirmação
  const Step4 = () => {
    // Função para formatar o gênero para exibição
    const getGeneroDisplay = () => {
      const generoMap = {
        "mulher_cis": "Mulher cis",
        "homem_cis": "Homem cis",
        "mulher_trans": "Mulher trans",
        "homem_trans": "Homem trans",
        "pessoa_nao_binaria": "Pessoa não binária",
        "genero_fluid": "Gênero fluid",
        "outro": patientData.generoOutro || "Outro",
        "prefere_nao_responder": "Prefere não responder"
      };
      return generoMap[patientData.genero] || "Não informado";
    };

    return (
      <Section title="Confirmação" subtitle="Revise os dados antes de finalizar">
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
      </Section>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Barra de Progresso */}
      <StepProgress />

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Renderiza a etapa atual */}
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </button>

          <div className="flex gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={onNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                onClick={onSave}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                <FileText size={18} />
                <span>{isSubmitting ? "Salvando..." : "Finalizar Cadastro"}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

// 📦 Componente de Seção
function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="mb-6">
        <h2 className="font-semibold text-2xl text-gray-800 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// 📦 Componente de Input reutilizável
function InputField({ label, name, value, onChange, type = "text", placeholder, error, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1 block">{error}</span>}
    </div>
  );
}

// 📦 Componente de TextArea
function TextAreaField({ name, value, onChange, placeholder, rows = 3, error }) {
  return (
    <div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1 block">{error}</span>}
    </div>
  );
}

// 📦 Componente de Select
function SelectField({ label, name, value, onChange, options, error, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-600 text-sm mt-1 block">{error}</span>}
    </div>
  );
}

// 📦 Componente de Radio Group
function RadioGroup({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// 📦 Componente para exibir informações na etapa de confirmação
function InfoField({ label, value }) {
  return (
    <div>
      <span className="text-sm text-gray-500 block mb-1">{label}</span>
      <span className="font-medium text-gray-800 block">{value || "Não informado"}</span>
    </div>
  );
}

export default FormPacient;