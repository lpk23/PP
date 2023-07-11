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

app.use(express.static(__dirname + '/page'));
// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
