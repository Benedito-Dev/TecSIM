import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../../context/RegisterContext';

export const useRegisterData = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    peso_kg: '',
    data_nascimento: '',
    genero: '',
    aceite_termos: true
  });

  const [validation, setValidation] = useState({
    validCpf: false,
    validEmail: false,
    validPassword: false,
    validWeight: false,
    validDate: false,
    validGender: false
  });

  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const { setRegisterData } = useRegister();

  const allValid = Object.values(validation).every(Boolean);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateValidation = (field, isValid) => {
    setValidation(prev => ({ ...prev, [field]: isValid }));
  };

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
      console.log('Enviando OTP para:', formData.email);
      
      setRegisterData(formData);

      alert('Código enviado! Verifique seu e-mail.');
      navigate('/verify');
    } catch (err) {
      alert('Falha ao enviar código de verificação.');
    }
  }, [allValid, formData, setRegisterData, navigate]);

  return {
    formData,
    validation,
    showTerms,
    allValid,
    updateField,
    updateValidation,
    setShowTerms,
    handleCreateAccount,
    handleAcceptTerms
  };
};