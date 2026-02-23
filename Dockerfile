FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG JWT_SECRET=tajna
ARG DATABASE_URL=postgres://postgres:postgres@db:5432/sala_baza
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]