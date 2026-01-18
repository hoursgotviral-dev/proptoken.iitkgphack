FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies including devDependencies (needed for build)
RUN npm install

COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
