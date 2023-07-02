const express = require("express");
const app = express();
const routes = require("./routes");

// создаем парсер для данных в формате json
const jsonParser = express.json();

app.use("/api", jsonParser, routes);


app.get("/", function(request, response){

    response.sendFile(__dirname +"/page" +"/login.html");
});
app.use(express.static(__dirname + '/page'));
// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
