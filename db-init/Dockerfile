FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Expor não é necessário, pois o db-init não expõe portas
CMD ["node", "createTables.js"]   # padrão, muda para seedData.js se quiser rodar seeds
