const CardCliente = ({ cliente, onIniciarAtendimento, onVerDetalhes, onEditar }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-800 text-lg">{cliente.nome}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              cliente.status === 'ativo' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">CPF:</span>
              <span>{cliente.cpf}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>{cliente.telefone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Última compra: {cliente.ultimaCompra}</span>
            </div>
            <div className="flex items-center gap-2">
              <Pill size={14} />
              <span>{cliente.medicamentosContinuos.length} med. contínuos</span>
            </div>
          </div>

          {cliente.alergias.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-medium text-red-600">⚠️ Alergias: </span>
              <span className="text-xs text-red-600">{cliente.alergias.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Botão Iniciar Atendimento */}
        <button
          onClick={() => onIniciarAtendimento(cliente)}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Stethoscope size={14} />
          Atendimento
        </button>
        
        <button
          onClick={() => onVerDetalhes(cliente)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Eye size={14} />
          Detalhes
        </button>
        
        <button 
          onClick={() => onEditar(cliente)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <Edit size={14} />
          Editar
        </button>
      </div>
    </div>
  </div>
);