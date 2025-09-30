import api from '../../api/api';

/**
 * Envia um código OTP para o email fornecido.
 * @param {string} email - O email do usuário para receber o OTP.
 * @returns {Promise<{email: string, expires_at: string}>}
 */
export const requestOtp = async (email) => {
  try {
    const response = await api.post('/auth/request-otp', { email });

    return {
      email: response.data.data.email,
      expires_at: response.data.data.expires_at,
      // otp: response.data.otp, // só se estiver vindo (normalmente backend oculta)
    };
  } catch (error) {
    console.error('Erro ao solicitar OTP:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    });

    let errorMessage = 'Erro ao solicitar código de verificação.';

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Verifica o código OTP enviado para o email.
 * @param {string} email - O email que recebeu o OTP.
 * @param {string} otp - O código OTP que o usuário digitou.
 * @returns {Promise<string>} Mensagem de sucesso do backend.
 */
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });

    return response.data.message; // Ex: "OTP verificado com sucesso."
  } catch (error) {
    console.error('Erro ao verificar OTP:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    });

    let errorMessage = 'Erro ao verificar código.';

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    throw new Error(errorMessage);
  }
};
