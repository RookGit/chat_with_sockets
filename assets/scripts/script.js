var debug = true;
var server_api = '/api';
var socket;

if (debug !== true)
    console.log = function () {};

$(function () {

    if (
        system.url[0] === 'root' ||
        system.url[0] === 'login'
    ) {

        var need_show_login_form = true;

        if (system.check_login_browser()) {

            system.alert.add('Происходит проверка авторизации!');

            sendDataWithWrapper({'key': system.get_auth_key()}, 'check_reg', function (data) {
                if (data.result === true) {
                    // TODO: Проверка успешна, данный пользователь уже есть в ls сервера, подключить к серверу!
                }
                else {
                    system.alert.add('Вы имеете не валидный auth key! Заполните данные для входа в чат!', 'dark');
                    need_show_login_form = true;
                }
            });

        }
        else {
            system.alert.add('Заполните данные для входа в чат!');
            need_show_login_form = true;
        }

        if (need_show_login_form === true) {
            hide_loader();
            show_block('welcome');
        }
    } else if (
        system.url[0] === 'chat'
    ) {

        var need_show_chat_form = true;

        if (system.check_login_browser()) {


            sendDataWithWrapper({'key': system.get_auth_key()}, 'check_reg', function (data) {
                console.log(data);

                socket = io.connect();

                socket.on('send_message', function (data) {

                    data.this_user = false;

                    system.message.add(data);

                    console.log('Пришло сообщение: ',data);
                });

                socket.on('online_list', function (data) {

                    var count = 0;

                    $('[data-context="users_field"]').empty();

                    data.forEach(function(element) {
                        count++;
                        $('[data-context="users_field"]').append('<h4>'+element+'</h4>');
                    });


                    $('[data-context="count_online"]').text(count);
                });

            });
                

        }
        else
        {

            system.alert.add('Вы не авторизованы!', 'danger');
            need_show_chat_form = false;

            system.redirect('/login');
        }

        if (need_show_chat_form === true) {
            hide_loader();
            show_block('chat');
        }
    }


});


$('[data-click="send_message"]').click(function (event) {
    var text_message = $('[name="message_chat"]').val();

    var length_message = text_message.toString().length;
    if (length_message > 0) {

        if(length_message <= 200)
        {

            var message_object = {
                'name': 'Вы:',
                'message': text_message,
                'date': system.getTimeByUnix($.now()),
                'this_user': true,
                'key': system.get_auth_key(),
            };

            system.message.add(message_object);

            socket.emit('send_message', message_object);

            system.alert.add('Сообщение отправлено!', 'success');

            $('[name="message_chat"]').val('');
        }
        else
        {
            system.alert.add('Сообщение не может быть длиннее 200 символов!', 'danger');
        }
    }
    else
    {
        system.alert.add('Введите сообщение для отправки!', 'danger');
    }
});

$('[data-click="reg_user"]').click(function (event) {
    event.preventDefault();

    var user_name = $('[name="name"]').val();

    if (
        typeof user_name === 'string' &&
        user_name.length > 0
    )
        sendDataWithWrapper({'name': user_name}, 'reg_user', function (data) {
            if (data.result === true) {
                system.set_auth_key(data.key);
                system.alert.add('Вы успешно авторизованы!');
                system.redirect('/chat');
            }
            else {
                system.alert.add('Авторизация не успешна! Что-то пошло не так!', 'danger');
            }
        });
    else
        system.alert.add('Введите корректное имя!', 'danger');
});


function sendDataWithWrapper(data, name_method, callback) {

    var params = new Array();

    params.push({
        name: 'method',
        value: name_method
    });


    params.push({
        name: 'data',
        value: JSON.stringify(data)
    });

    // Время отправления запроса
    params.push({
        name: 'time_request',
        value: $.now()
    });

    sendRequest(params, callback);
}

function sendRequest(params, callback) {
    $.ajax({
        type: 'POST',
        url: server_api,
        // dataType: 'json',
        // async: false,
        data: params,
        success: callback,
        error: function (data) {
            // ...
        }
    });
}

function hide_loader() {
    $('[data-context="loader"]').hide();
}

function show_block(block_context) {
    $('[data-context="' + block_context + '"]').removeClass('d-none');
}