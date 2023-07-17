const express = require("express");
const app = express();
const routes = require("./routes");
// создаем парсер для данных в формате json
const jsonParser = express.json();

app.use("/api", jsonParser, routes);

const page=__dirname +"/page/"
app.get("/", function(request, response){
    response.sendFile( page+"index.html");
});
app.get("/auth",function(request, response){
    response.sendFile(page+"auth.html");
});
app.get("/reg",function(request, response){
    response.sendFile(page+"reg.html");
});
app.get("/reset",function(request, response){
    response.sendFile(page+"reset.html");
});
app.get("/employers",function (request, response){
    response.sendFile(page+'employers.html')
});
app.get("/employer/:id",function (request, response){
    response.sendFile(page+'employers.html')
});
app.get("/students",function (request, response){
    response.sendFile(page+'students.html')
});
app.get("/student/add",function (request, response){
    response.sendFile(page+'student.html')
});
app.get("/student/:id",function (request, response){
    response.sendFile(page+'lk_student.html')
});
app.get("/import",function (request, response){
    response.sendFile(page+'import.html')
});
app.get("/export",function (request, response){
    response.sendFile(page+'export.html')
});
app.use(express.static(__dirname + '/page'));
// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
