FROM node:18.16.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Set environment variables for PostgreSQL
ENV PGHOST=postgres
ENV PGPORT=5432
ENV PGDATABASE=db
ENV PGUSER=postgres
ENV PGPASSWORD=admin

# Wait for the PostgreSQL service to start
CMD sleep 5 && npx sequelize-cli db:migrate && npm start