import React from "react";
import { User, Mail, Phone, Calendar, MapPin, Stethoscope, Clock, Edit } from "lucide-react";
import Sidebar from "../../components/SideBarr";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  
  const enfermeiro = {
    nome: "Ana Beatriz Santos",
    cargo: "Enfermeira Responsável",
    email: "ana.santos@clinifarma.com",
    telefone: "(85) 99999-1234",
    registro: "COREN-CE 123456",
    unidade: "CliniFarma - Unidade Centro",
    turno: "08:00 às 18:00",
    dataAdmissao: "15/03/2023",
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleEditProfile = () => {
    // Navegar para a tela de edição de perfil
    navigate('/perfil/editar');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Navbar */}
        <div className="h-20 bg-sky-600 shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Stethoscope size={28} className="text-red-500" />
              <h1 className="text-2xl font-bold text-white">Perfil do Enfermeiro</h1>
            </div>
          </div>

          <button 
            onClick={handleEditProfile}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Edit size={18} />
            <span>Editar Perfil</span>
          </button>
        </div>

        {/* Conteúdo do perfil */}
        <div className="flex-1 overflow-y-auto ml-20 lg:ml-60 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Card principal */}
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
              {/* Linha superior */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Foto de perfil */}
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-4xl font-bold">
                  {enfermeiro.nome.split(" ")[0][0]}
                  {enfermeiro.nome.split(" ")[1][0]}
                </div>

                {/* Dados principais */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">{enfermeiro.nome}</h2>
                  <p className="text-gray-500 text-lg mb-6">{enfermeiro.cargo}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <Mail size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{enfermeiro.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <Phone size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{enfermeiro.telefone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <Calendar size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Data de Admissão</p>
                        <p className="font-medium">{enfermeiro.dataAdmissao}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <MapPin size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Unidade</p>
                        <p className="font-medium">{enfermeiro.unidade}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha inferior */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600 mb-2 font-medium">Registro Profissional</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                    <User size={20} className="text-blue-600" /> 
                    {enfermeiro.registro}
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <p className="text-sm text-green-600 mb-2 font-medium">Turno de Trabalho</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                    <Clock size={20} className="text-green-600" /> 
                    {enfermeiro.turno}
                  </p>
                </div>

                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <p className="text-sm text-purple-600 mb-2 font-medium">Unidade Atual</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                    <MapPin size={20} className="text-purple-600" /> 
                    {enfermeiro.unidade}
                  </p>
                </div>
              </div>

              {/* Informações adicionais (opcional) */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Status</span>
                    <span className="font-medium text-green-600">Ativo</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Especialidade</span>
                    <span className="font-medium">Enfermagem Geral</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Anos de Experiência</span>
                    <span className="font-medium">5 anos</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Última Atualização</span>
                    <span className="font-medium">15/01/2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}