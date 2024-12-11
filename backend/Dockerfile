FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]

# docker build -t m4-backend .
# docker run -p 3000:3000 --name m4-backend -e PORT=port -e GEMINI_API_KEY=API_KEY m4-backend