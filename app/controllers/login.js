const params = {};

exports.run =  function (request) {

    params.title = 'Авторизация';
    params.name = 'Григорий';
    params.need_login = false;

    return {'tpl': 'login', 'params': params};
};