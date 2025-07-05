# Usa imagem do Node
FROM node:18

# Define o diretório dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./

# Instala dependências (incluindo dev)
RUN npm install

# Instala o nodemon globalmente (opcional, mas recomendado)
RUN npm install -g nodemon

# Copia o restante do projeto
COPY . .

# Expõe a porta (ajuste conforme sua API)
EXPOSE 3000

# Comando pra rodar no modo dev
CMD ["npm", "run", "dev"]
