import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../context/RegisterContext';
// Mantenha todos os seus imports
import CpfInput from '../components/Inputs/CpfInput'
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';
import PesoInput from '../components/Inputs/PesoInput';
import DateInput from '../components/Inputs/DataInput';
import GenderInput from '../components/Inputs/InputGender';
import InputField from '../components/Inputs/InputField';
import TermsModal from '../components/Inputs/TermsModal';
import { lightTheme } from '../constants/temas';

import logoImage from '../assets/images/logo.png';

import { requestOtp } from '../services/auth/otpService';


export default function RegisterPage() {
    // --- States de Dados ---
    const [cpf, setCpf] = useState('');
    const [nome, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setPassword] = useState('');
    const [peso_kg, setWeight] = useState('');
    const [data_nascimento, setBirthDate] = useState('');
    const [genero, setGender] = useState(''); // Estado para o Gênero
    const [aceite_termos, setTerms] = useState(true); // Estado para o Gênero
    
    // --- States de Validação ---
    const [validCpf, setValidCpf] = useState(false)
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validWeight, setValidWeight] = useState(false);
    const [validDate, setValidDate] = useState(false);
    const [validGender, setValidGender] = useState(false); // Estado de validação do Gênero

    const [showTerms, setShowTerms] = useState(false);

    const navigate = useNavigate();
    const { setRegisterData } = useRegister();

    // Validação geral: agora inclui o validGender
    const allValid =  validCpf && validEmail && validPassword && validWeight && validDate && validGender;

    const handleCreateAccount = () => {
        setShowTerms(true);
    };

    const handleAcceptTerms = async () => {
        setShowTerms(false);

        if (!allValid) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        try {
            const response = await requestOtp(email); // função que envia o OTP
            if (response?.email) {
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
            navigate('/verify'); // vai para a tela de verificação
            } else {
            alert('Erro ao enviar código. Tente novamente.');
            }
        } catch (err) {
            alert('Falha ao enviar código de verificação.');
        }
        };

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
                    <div className="mx-auto w-20 h-20 mb-3 flex items-center justify-center">
                        <img src={logoImage} alt="" />
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
                            <InputField
                                label="Nome Completo"
                                value={nome}
                                onChangeText={setName}
                                placeholder="Seu nome"
                                theme={lightTheme}
                            />
                            <CpfInput
                                value={cpf}
                                onChangeText={setCpf}
                                onValidityChange={setValidCpf}
                                theme={lightTheme}
                            />
                            <EmailInput
                                value={email}
                                onChangeText={setEmail}
                                onValidityChange={setValidEmail}
                                theme={lightTheme}
                            />
                            <PasswordInput
                                onChangeText={setPassword}
                                onValidityChange={setValidPassword}
                                theme={lightTheme}
                            />
                        </div>

                        {/* COLUNA 2: Peso, Data de Nascimento, Gênero */}
                        <div className="space-y-6">
                            <PesoInput
                                label="Peso (kg)"
                                value={peso_kg}
                                onChangeText={setWeight}
                                onValidityChange={setValidWeight}
                                theme={lightTheme}
                            />
                            <DateInput
                                label="Data de Nascimento"
                                value={data_nascimento}
                                onChange={setBirthDate}
                                onValidityChange={setValidDate}
                                theme={lightTheme}
                            />
                            {/* Input de Gênero Personalizado e Estilizado */}
                            <div className="pt-2"> 
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gênero
                                </label>
                                <GenderInput
                                    value={genero}
                                    onChange={(val) => {
                                        setGender(val);
                                        setValidGender(!!val); // Valida se algum valor foi escolhido
                                    }}
                                    theme={lightTheme}
                                    fontSize={16}
                                />
                                {/* OBS: O componente GenderInput deve ser um SELECT ou Radios para funcionar bem aqui */}
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

            {/* Modal de Termos */}
            <TermsModal
                visible={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleAcceptTerms}
            />
        </div>
    );
}