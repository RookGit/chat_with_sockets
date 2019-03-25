// Подключаем модули
const express = require('express');
const app = express();
const server = require('http').createServer(app);
global.io = require('socket.io').listen(server);
const twig = require('twig');
const bodyParser = require('body-parser')

// Для парсинга тела запроса в json
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

// var fs = require('fs');
// fs.writeFile('myjsonfile.json', {''} , 'utf8', callback);

// Подключаем глобально функции для управления данными
global.chat = require('./app/models/userKeyControl.js');

// Храним информацию о данных пользователя по ключу
global.users_chat_online = {};

/**
 {
    'key': 'name'
 }
 */

// Храним информацию о соединениях по ключу
global.users_connections = {};
/**
 {
    'connect': 'key'
 }
 */

// Загружаем роуты
const routes = require('./app/routes.json');

// Устанавливаем папку с шаблонами для twig
app.set('views', './app/views');

// Устанавливаем папку для статики
app.use('/assets', express.static('./assets'));

// Слушаем по 3000 порту
server.listen(3000);

// var test = {'key': 'val'};
// console.log(test);
// console.log(test.key);
// console.log(test['key']);
// console.log('key' in test);
// delete test['key'];
//
// console.log(test.key);
// console.log(test['key']);
// console.log('key' in test);

// Подключаем роуты
for (let rout in routes) {

    const action = routes[rout]['method'];

    app[action]('/' + rout, function (request, response) {

        const controller_file = routes[rout]['controller'];
        const controller = require('./app/controllers/' + controller_file);

        // Запускаем метод run у подключенного контроллера
        const data = controller.run(request, response);

        // Подгружаем шаблоны через шаблонизатор twig
        if(
            typeof data != 'undefined' &&
            typeof data.tpl != 'undefined' &&
            typeof data.params != 'undefined'
        )
        response.render(`${data.tpl}.twig`, data.params);
    });
}

