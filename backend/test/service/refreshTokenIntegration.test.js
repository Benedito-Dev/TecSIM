const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

class RefreshTokenIntegrationTest {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;
  }

  async testLogin() {
    console.log('🔐 Testando login...');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          senha: '123456',
          tipo: 'paciente'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no login');
      }

      this.accessToken = data.token;
      this.refreshToken = data.refreshToken;
      this.userId = data.usuario.id;

      console.log('✅ Login realizado com sucesso');
      console.log('Access Token:', this.accessToken ? 'Presente' : 'Ausente');
      console.log('Refresh Token:', this.refreshToken ? 'Presente' : 'Ausente');
      return true;
    } catch (error) {
      console.log('❌ Erro no login:', error.message);
      return false;
    }
  }

  async testRefreshToken() {
    console.log('\n🔄 Testando refresh token...');
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no refresh');
      }

      const oldAccessToken = this.accessToken;
      const oldRefreshToken = this.refreshToken;

      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;

      console.log('✅ Refresh token bem-sucedido');
      console.log('Access Token alterado:', oldAccessToken !== this.accessToken);
      console.log('Refresh Token alterado:', oldRefreshToken !== this.refreshToken);
      return true;
    } catch (error) {
      console.log('❌ Erro no refresh token:', error.message);
      return false;
    }
  }

  async testRevokeToken() {
    console.log('\n🚫 Testando revogação de token...');
    try {
      const response = await fetch(`${API_URL}/auth/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao revogar');
      }

      console.log('✅ Token revogado com sucesso');

      // Tenta usar o token revogado
      try {
        const testResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken
          })
        });

        if (testResponse.ok) {
          console.log('❌ Token revogado ainda funciona (ERRO!)');
          return false;
        } else {
          console.log('✅ Token revogado não funciona mais (correto)');
          return true;
        }
      } catch (error) {
        console.log('✅ Token revogado não funciona mais (correto)');
        return true;
      }
    } catch (error) {
      console.log('❌ Erro ao revogar token:', error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Iniciando testes de integração do Refresh Token\n');

    const results = {
      login: await this.testLogin(),
      refreshToken: false,
      revokeToken: false
    };

    if (results.login) {
      results.refreshToken = await this.testRefreshToken();
      
      if (results.refreshToken) {
        results.revokeToken = await this.testRevokeToken();
      }
    }

    console.log('\n📊 Resultados dos testes:');
    console.log('Login:', results.login ? '✅' : '❌');
    console.log('Refresh Token:', results.refreshToken ? '✅' : '❌');
    console.log('Revogação:', results.revokeToken ? '✅' : '❌');

    const allPassed = Object.values(results).every(result => result === true);
    console.log('\n🎯 Resultado geral:', allPassed ? '✅ TODOS OS TESTES PASSARAM' : '❌ ALGUNS TESTES FALHARAM');

    return allPassed;
  }
}

// Executa os testes se o arquivo for executado diretamente
if (require.main === module) {
  const tester = new RefreshTokenIntegrationTest();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = RefreshTokenIntegrationTest;