FROM node:20

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package.json package-lock.json* ./
RUN npm install -g expo-cli @expo/ngrok && npm install

# Copiar código do projeto
COPY . .

# Expor as portas usadas pelo Expo
EXPOSE 8081 19000 19001 19002

# Comando para iniciar o Expo
CMD ["npx", "expo", "start"]