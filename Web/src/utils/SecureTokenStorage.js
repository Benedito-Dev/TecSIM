// Secure Token Storage com proteções contra XSS
class SecureTokenStorage {
  constructor() {
    this.prefix = '__tecsim_secure_';
    this.fingerprint = this.generateFingerprint();
  }

  // Gera fingerprint do browser para validação
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('TecSim Security', 2, 2);
    
    return btoa(JSON.stringify({
      userAgent: navigator.userAgent.slice(0, 100), // Limitado para evitar overflow
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL().slice(0, 50), // Limitado
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }));
  }

  // Criptografia simples (XOR) para tokens
  encrypt(data) {
    const key = this.fingerprint.slice(0, 32);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  decrypt(encryptedData) {
    try {
      const data = atob(encryptedData);
      const key = this.fingerprint.slice(0, 32);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return null;
    }
  }

  setSecureItem(key, value) {
    try {
      const secureData = {
        value: this.encrypt(value),
        fingerprint: this.fingerprint,
        timestamp: Date.now(),
        checksum: this.generateChecksum(value)
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(secureData));
      return true;
    } catch (error) {
      console.error('Erro ao salvar token seguro:', error);
      return false;
    }
  }

  getSecureItem(key) {
    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) return null;

      const secureData = JSON.parse(stored);
      
      // Validar fingerprint
      if (secureData.fingerprint !== this.fingerprint) {
        this.removeSecureItem(key);
        return null;
      }

      // Validar idade (máximo 30 dias)
      const maxAge = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - secureData.timestamp > maxAge) {
        this.removeSecureItem(key);
        return null;
      }

      const decrypted = this.decrypt(secureData.value);
      
      // Validar checksum
      if (this.generateChecksum(decrypted) !== secureData.checksum) {
        this.removeSecureItem(key);
        return null;
      }

      return decrypted;
    } catch (error) {
      console.error('Erro ao recuperar token seguro:', error);
      this.removeSecureItem(key);
      return null;
    }
  }

  removeSecureItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  generateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Erro ao limpar tokens:', error);
    }
  }
}

export default SecureTokenStorage;