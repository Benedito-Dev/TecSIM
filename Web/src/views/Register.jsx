import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../context/RegisterContext';

export default function RegisterPage() {
    // --- States de Dados ---
    const [cpf, setCpf] = useState('');
    const [nome, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setPassword] = useState('');
    const [peso_kg, setWeight] = useState('');
    const [data_nascimento, setBirthDate] = useState('');
    const [genero, setGender] = useState('');
    const [aceite_termos, setTerms] = useState(true);
    
    // --- States de Validação ---
    const [validCpf, setValidCpf] = useState(false)
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validWeight, setValidWeight] = useState(false);
    const [validDate, setValidDate] = useState(false);
    const [validGender, setValidGender] = useState(false);

    const [showTerms, setShowTerms] = useState(false);

    const navigate = useNavigate();
    const { setRegisterData } = useRegister();

    // Validação geral
    const allValid = validCpf && validEmail && validPassword && validWeight && validDate && validGender;

    const handleCreateAccount = useCallback(() => {
        setShowTerms(true);
    }, []);

    const handleAcceptTerms = useCallback(async () => {
        setShowTerms(false);

        if (!allValid) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        try {
            // Simula envio de OTP
            console.log('Enviando OTP para:', email);
            
            setRegisterData({
                cpf,
                nome,
                email,
                senha,
                data_nascimento,
                peso_kg,
                genero,
                aceite_termos
            });

            alert('Código enviado! Verifique seu e-mail.');
            navigate('/verify');
        } catch (err) {
            alert('Falha ao enviar código de verificação.');
        }
    }, [allValid, email, cpf, nome, senha, data_nascimento, peso_kg, genero, aceite_termos, setRegisterData, navigate]);

    return (
        // Fundo clean: Quase branco com um toque suave de azul
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 lg:p-10 relative overflow-hidden">
            
            {/* Efeitos de Fundo Sutil (Mantidos do Neo-Brutalista Suave) */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 opacity-30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-pulse-slow animation-delay-3000"></div>


            {/* Container Principal */}
            <div className="w-full max-w-5xl mx-auto z-10 animate-fade-in-down">
                
                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    {/* Logo Estilizada (Círculo Azul) */}
                    <div className="mx-auto w-20 h-20 mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                        <span className="text-white text-2xl font-bold">TS</span>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Crie Sua Conta de Saúde
                    </h1>
                    <p className="text-gray-600 mt-1 text-lg">
                        Insira seus dados para começar a usar a plataforma.
                    </p>
                </div>

                {/* Cartão do Formulário: Estilo "Tech-Plate" */}
                <div className="bg-white p-6 md:p-10 rounded-2xl border-2 shadow-lg">
                    
                    {/* Layout de Grid para Múltiplos Inputs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* COLUNA 1: Nome, Email, Senha */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => {
                                        setCpf(e.target.value);
                                        setValidCpf(e.target.value.length >= 11);
                                    }}
                                    placeholder="000.000.000-00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setValidEmail(e.target.value.includes('@'));
                                    }}
                                    placeholder="seu@email.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setValidPassword(e.target.value.length >= 6);
                                    }}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* COLUNA 2: Peso, Data de Nascimento, Gênero */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Peso (kg)
                                </label>
                                <input
                                    type="number"
                                    value={peso_kg}
                                    onChange={(e) => {
                                        setWeight(e.target.value);
                                        setValidWeight(e.target.value > 0);
                                    }}
                                    placeholder="Ex: 70"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Data de Nascimento
                                </label>
                                <input
                                    type="date"
                                    value={data_nascimento}
                                    onChange={(e) => {
                                        setBirthDate(e.target.value);
                                        setValidDate(!!e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gênero
                                </label>
                                <select
                                    value={genero}
                                    onChange={(e) => {
                                        setGender(e.target.value);
                                        setValidGender(!!e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>
                        </div>
                    </div> {/* Fim do Grid */}

                    {/* Botão Principal - Alto Contraste (Fica em linha inteira, fora do grid) */}
                    <button
                        onClick={handleCreateAccount}
                        disabled={!allValid}
                        className={`
                            mt-10 w-full py-4 rounded-lg font-bold text-white text-xl 
                            border-2 border-gray-800 
                            transition-all duration-200 transform
                            focus:outline-none focus:ring-4 focus:ring-sky-300
                            ${allValid
                                ? 'bg-sky-600 hover:bg-sky-700 shadow-custom-button hover:translate-x-0.5 hover:translate-y-0.5' // Efeito de pressão
                                : 'bg-gray-400 cursor-not-allowed border-gray-500'
                            }
                        `}
                    >
                        CRIAR MINHA CONTA
                    </button>
                </div>

                {/* Link para Login */}
                <div className="text-center mt-6">
                    <p className="text-gray-700">
                        Já possui uma conta?{' '}
                        <a href="/login" className="font-bold text-sky-600 hover:text-sky-800 hover:underline transition-colors">
                            Acesse aqui
                        </a>
                    </p>
                </div>
            </div>

            {/* Modal de Termos - Simples */}
            {showTerms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-bold mb-4">Termos de Uso</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowTerms(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAcceptTerms}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Aceitar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}