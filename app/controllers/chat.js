let params = {};

exports.run = function (request, response) {

    params.title = 'Чат';

    return {'tpl': 'chat', 'params': params};

    if (user_key !== null
        && typeof users_chat[user_key] != 'undefined'
    ) {



    }
    else {
        return true;
        let name = 'test';

        let key = chat.generateKey('test');


        // Не удалось :(
        // response.writeHead(302, {
        //     'Location': '/'
        // });
        // response.end();

        params.title = 'Требуется авторизация!';
        params.need_login = true;

        return {'tpl': 'chat', 'params': params};
    }


};