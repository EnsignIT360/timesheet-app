FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY index.js ./
EXPOSE 5000
CMD ["npm", "start"]
