// Serviço para recuperação de senha
// TODO: Implementar integração com backend

export const forgotPassword = async (email) => {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, userType: 'farmaceutico' }),
    });

    if (!response.ok) {
      throw new Error('Erro ao processar solicitação');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no forgotPassword:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Erro ao redefinir senha');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no resetPassword:', error);
    throw error;
  }
};

export const validateResetToken = async (token) => {
  try {
    const response = await fetch(`/api/auth/validate-token/${token}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no validateResetToken:', error);
    throw error;
  }
};