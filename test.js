module.exports = class Router {

}



app.get('/login', function (request, response) {
    response.sendFile(__dirname + '/index.html');

});