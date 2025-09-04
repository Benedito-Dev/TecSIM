# Usa Node.js
FROM node:20

# Define o diretório dentro do container
WORKDIR /app

# Copia arquivos de dependência
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm install

# Instala Expo CLI globalmente
RUN npm install -g expo-cli

# Copia o restante do projeto
COPY . .

# Expõe a porta do Metro bundler (default Expo)
EXPOSE 8081

# Comando para rodar o Expo no modo dev
CMD ["npx", "expo", "start", "--tunnel", "--port", "8081"]
