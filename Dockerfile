FROM node:18.16.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80

ENV PGHOST=postgres
ENV PGPORT=5432
ENV PGDATABASE=db
ENV PGUSER=postgres
ENV PGPASSWORD=admin

CMD sleep 5 && npm start