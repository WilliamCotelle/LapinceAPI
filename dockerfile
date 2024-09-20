# Utiliser une image de base officielle de Node.js
FROM node:14

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tout le code source de l'application dans le répertoire de travail
COPY . .

# Exposer le port sur lequel l'application Node.js écoute
EXPOSE 4000

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
