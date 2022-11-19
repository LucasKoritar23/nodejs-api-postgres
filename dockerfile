# Imagem de Origem
FROM node:14-alpine
# Diretório de trabalho(é onde a aplicação ficará dentro do container).
WORKDIR /voce-sabia-api-v1
COPY . /voce-sabia-api-v1
# COPY package-lock.json /kfkfront/package-lock.json
RUN npm install -g npm@latest
RUN npm install cors
RUN npm install strftime
RUN npm install
EXPOSE 3000
# Inicializa a aplicação
CMD ["node", "index.js"]