# Usa a imagem base oficial do Playwright, que já inclui o Chromium e dependências.
# Usamos a versão 1.46.0-jammy, conforme o exemplo (você pode usar :latest se preferir)
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes primeiro
# Isso aproveita o cache do Docker. Se 'package.json' não mudar, o 'npm ci' não roda de novo.
COPY package.json .
COPY package-lock.json .

# Instala as dependências de forma "limpa" (Clean Install)
RUN npm ci --silent

# O professor sugeriu rodar 'npx playwright install',
# mas a imagem 'mcr.microsoft.com/playwright' já vem com tudo.
# Então, esta linha é geralmente desnecessária:
# RUN npx playwright install --with-deps chromium

# Copia todo o resto do código do seu projeto para o container
COPY . .

# Executa o script de build (que cria a pasta dist/) dentro do container
RUN npm run build

# Define o comando padrão que será executado quando o container rodar
# (Neste caso, ele roda o build de novo e depois os testes)
CMD ["npm", "test"]