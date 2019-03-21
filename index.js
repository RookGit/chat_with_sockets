var express = require('express');
var app = express();
var server = require('http').createServer(app);
global.io = require('socket.io').listen(server);

var routes = require('./app/routes.json');

server.listen(3000);

for (let rout in routes) {
    app.get('/' + rout, function (request, response) {

        const controller_file = routes[rout]['controller'];
        const controller = require('./app/controllers/' + controller_file);

        const view = controller.run(request.query);

        if (view != false)
            response.sendFile(__dirname + '/' + view + '.html');
    });
}

