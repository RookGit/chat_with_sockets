exports.run = function (request, response) {

    var resp = {'result': false};

    let method = request.body.method;
    let data = JSON.parse(request.body.data);
    let time_request = request.body.time_request;

    switch (method) {
        case 'get_all_messages':
            break;

        case 'check_reg':
            var key = data.key;
            var name = chat.get_name_by_key(key);

            if (name !== false)
            {

                io.sockets.on('connection', function (socket) {

                    console.log(`Подключение по сокетам ${name} ${key}`);

                    users_connections[key] = socket;
                    users_chat_online[key] = name;

                    io.emit('online_list', Object.values(users_chat_online));

                    io.sockets.emit('online_list', Object.values(users_chat_online));

                    socket.on('send_message', function (data) {
                        data.name = chat.get_name_by_key(data.key);
                        // delete data.key;

                        if (data.name !== false) {

                            socket.broadcast.emit('send_message', data);
                        }

                    });

                    socket.on('disconnect', function () {
                        console.log(`Отключение по сокетам ${name} ${key}`);
                        delete users_connections[key];
                        delete users_chat_online[key];

                    });

                });
            }
            break;

        case 'reg_user':

            console.log(data);
            var user_name = data.name;

            if (chat.valid_name(user_name)) {
                let key = chat.generate_key(user_name);
                resp.result = true;
                resp.key = key;

                chat.set_key(key, user_name);
            }

            break;

        default:
            resp.request = 'Method api not found!';
            break;
    }

    response.send(resp);

};