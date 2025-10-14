import React from 'react';

const TermsModal = ({ visible, onAccept, onClose }) => {
  const openEmail = () => {
    window.location.href = 'mailto:tecsimassistente@gmail.com';
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-white w-[90%] max-w-3xl rounded-xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Termos de Uso</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 flex-1 space-y-4 text-gray-700 text-sm">
          <section>
            <h3 className="text-blue-600 font-bold mb-2">1. Aceitação e Restrições</h3>
            <p>Ao utilizar o TecnSim, você declara que:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>É maior de 18 anos ou possui consentimento parental</li>
              <li>Fornecerá informações verdadeiras e completas</li>
              <li>Entendeu todos os termos e limitações</li>
              <li>Concorda em usar o aplicativo apenas como referência informativa</li>
            </ul>
          </section>

          <section>
            <h3 className="text-blue-600 font-bold mb-2">2. Cadastro de Dados</h3>
            <p>Para utilizar o TecSim, você deve fornecer as seguintes informações obrigatórias:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nome completo</li>
              <li>E-mail</li>
              <li>Senha</li>
              <li>Data de nascimento</li>
              <li>Identificação de sexo</li>
              <li>Peso</li>
            </ul>
            <p>
              Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta. Seus dados pessoais serão tratados conforme nossa Política de Privacidade. Caso suspeite de uso não autorizado de sua conta, você deve notificar imediatamente através de{' '}
              <span className="text-blue-600 underline cursor-pointer" onClick={openEmail}>
                tecsimassistente@gmail.com
              </span>.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 font-bold mb-2">3. Uso do Aplicativo</h3>
            <p>O TecSim é um aplicativo que fornece informações básicas de enfermagem para leigos, incluindo:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Orientações sobre medicamentos comuns e suas dosagens</li>
              <li>Informações sobre potenciais interações medicamentosas</li>
              <li>Cuidados caseiros para sintomas leves</li>
              <li>Cadastro e acompanhamento de prescrições médicas (deve incluir orientação completa do profissional de saúde)</li>
            </ul>
            <p className="text-red-700 font-bold mt-2">
              O TecSim <span className="underline">NÃO É UM SERVIÇO MÉDICO</span> e não substitui avaliação, diagnóstico ou tratamento profissional. Em caso de emergência médica, contate imediatamente o serviço de saúde local (ligue 192). As informações fornecidas são apenas para fins educacionais.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 font-bold mb-2">4. Limitação de Responsabilidade Médica</h3>
            <p>O TecSim não se responsabiliza por quaisquer danos resultantes do uso do aplicativo. As informações sobre medicamentos e dosagens são calculadas automaticamente com base em diretrizes gerais e <span className="underline">DEVEM SEMPRE SER CONFIRMADAS</span> por um profissional de saúde. Não nos responsabilizamos por:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Uso inadequado de medicamentos</li>
              <li>Efeitos adversos ou reações alérgicas</li>
              <li>Interações medicamentosas não detectadas</li>
              <li>Erros de dosagem ou administração</li>
            </ul>
          </section>

          <section>
            <h3 className="text-blue-600 font-bold mb-2">5. Alterações nos Termos</h3>
            <p>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Quaisquer alterações serão publicadas nesta página e entrarão em vigor imediatamente após a publicação. É sua responsabilidade revisar periodicamente os Termos de Uso para estar ciente de quaisquer alterações.</p>
          </section>

          <section>
            <h3 className="text-blue-600 font-bold mb-2">6. Contato</h3>
            <p>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: <span className="text-blue-600 underline cursor-pointer" onClick={openEmail}>tecsimassistente@gmail.com</span>.</p>
          </section>

          <section>
            <h3 className="text-blue-600 font-bold mb-2">7. Aceitação dos Termos</h3>
            <p>Ao clicar em "Concordo" ou ao utilizar o aplicativo, você confirma que leu e concorda com estes Termos de Uso.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onAccept}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Aceitar Termos
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
