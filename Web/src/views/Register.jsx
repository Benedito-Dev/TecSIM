import React, { useState } from 'react';
// Mantenha todos os seus imports
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';
import PesoInput from '../components/Inputs/PesoInput';
import DateInput from '../components/Inputs/DataInput';
import GenderInput from '../components/Inputs/InputGender';
import InputField from '../components/Inputs/InputField';
import TermsModal from '../components/Inputs/TermsModal';
import { lightTheme } from '../constants/temas';

import logoImage from '../assets/images/logo.png';


export default function RegisterPage() {
    // --- States de Dados ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState(''); 
    
    // --- States de Validação ---
    const [validName, setValidName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validWeight, setValidWeight] = useState(false);
    const [validDate, setValidDate] = useState(false);
    const [validGender, setValidGender] = useState(false); 

    const [showTerms, setShowTerms] = useState(false);

    const allValid = validName && validEmail && validPassword && validWeight && validDate && validGender;

    const handleCreateAccount = () => {
        setShowTerms(true);
    };

    const handleAcceptTerms = () => {
        setShowTerms(false);
        alert('Conta criada com sucesso!');
    };

    return (
        // MUDANÇA PRINCIPAL: Fundo escuro (sky-900) e container principal
        <div className="relative min-h-screen flex items-center justify-center bg-sky-900 p-4 lg:p-10 overflow-hidden">
            
            {/* EFEITO BLOBS ANIMADOS (O coração do design de fundo) */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-400 rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-600 rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-500 rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            {/* FIM BLOBS */}


            {/* Container Principal do Formulário */}
            <div className="w-full max-w-4xl mx-auto z-10 animate-fade-in-down">
                
                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    {/* Logo */}
                    <div className="mx-auto w-20 h-20 mb-3 flex items-center justify-center">
                        {/* Como o fundo é escuro, vamos garantir que a logo apareça bem */}
                        <img src={logoImage} alt="Logo" className="w-full h-full drop-shadow-lg" />
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Crie Sua Conta
                    </h1>
                    <p className="text-sky-200 mt-1 text-lg">
                        Comece a transformar seu bem-estar agora.
                    </p>
                </div>

                {/* Cartão do Formulário: ESTILO GLASSMORPHISM */}
                <div className="w-full bg-white/250 p-6 md:p-10 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20">
                    
                    {/* Layout de Grid para Múltiplos Inputs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* COLUNA 1: Nome, Email, Senha */}
                        <div className="space-y-6">
                            <InputField 
                                // MUDANÇA: Adicionado text-white/90 para os labels ficarem legíveis
                                label="Nome Completo"
                                // ... (Outras props)
                                theme={{...lightTheme, textPrimary: '#e5e7eb'}} // Passa texto claro para o label
                            />
                            <EmailInput 
                                // ...
                                theme={{...lightTheme, textPrimary: '#e5e7eb'}}
                            />
                            <PasswordInput 
                                // ...
                                theme={{...lightTheme, textPrimary: '#e5e7eb'}}
                            />
                        </div>

                        {/* COLUNA 2: Peso, Data de Nascimento, Gênero */}
                        <div className="space-y-6">
                            <PesoInput
                                // ...
                                theme={{...lightTheme, textPrimary: '#e5e7eb'}}
                            />
                            <DateInput
                                // ...
                                theme={{...lightTheme, textPrimary: '#e5e7eb'}}
                            />
                            {/* Input de Gênero */}
                            <div className="pt-2"> 
                                <label className="block text-sm font-semibold text-white/90 mb-2">
                                    Gênero
                                </label>
                                <GenderInput
                                    value={gender}
                                    onChange={(val) => {
                                        setGender(val);
                                        setValidGender(!!val);
                                    }}
                                    theme={{...lightTheme, textPrimary: '#e5e7eb'}} // Ajuste o tema
                                    fontSize={16}
                                />
                            </div>
                        </div>
                    </div> {/* Fim do Grid */}

                    {/* Botão Principal - DESTAQUE em cor sólida sobre o glassmorphism */}
                    <button
                        onClick={handleCreateAccount}
                        disabled={!allValid}
                        className={`
                            mt-10 w-full py-4 rounded-lg font-bold text-lg 
                            transition-all duration-300 transform shadow-lg
                            focus:outline-none focus:ring-4 focus:ring-sky-300
                            ${allValid
                                ? 'bg-sky-600 text-white hover:bg-sky-500 hover:scale-[1.01]' // Destaque na cor principal
                                : 'bg-gray-500 text-gray-200 cursor-not-allowed'
                            }
                        `}
                    >
                        CRIAR MINHA CONTA
                    </button>
                </div>

                {/* Link para Login */}
                <div className="text-center mt-6">
                    <p className="text-white/70">
                        Já possui uma conta?{' '}
                        <a href="/login" className="font-bold text-sky-400 hover:text-sky-300 hover:underline transition-colors">
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