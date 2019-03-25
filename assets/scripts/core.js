var system = {};

system.url = location.pathname.split('/');
system.url.splice(0, 1);

if (system.url[0] == '')
    system.url[0] = 'root';

// Сгенерировать случайный id
system.generate_rand_id = function (length) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz12345689";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

system.alert = {

    init: function () {

        $('body').append('<div class="text-right" style="z-index: 9999; position: fixed; top: 30px; right: 30px;" id="system-alert-wrapper"></div>');

        return this;
    },

    add: function (message, type) {

        var type = type || 'info';

        var rand_id = system.generate_rand_id(10);

        $('#system-alert-wrapper').prepend('' +
            '<div style="display: none; width: 300px;" data-alert="' + rand_id + '" class="alert text-left alert-' + type + ' op-9" role="alert">' +
            message +
            '&nbsp;&nbsp;<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>'
        );

        $('[data-alert="' + rand_id + '"]').fadeIn(200);

        setTimeout(function () {
            var element = $('[data-alert="' + rand_id + '"]');
            element.fadeOut(200, function () {
                element.remove();
            });
        }, 3000);


        return this;
    }
};

system.alert.init();

system.check_login_browser = function () {
    return localStorage.getItem('auth_key') !== null;
};

system.set_auth_key = function (key) {
    localStorage.setItem('auth_key', key);
};

system.get_auth_key = function () {
    return localStorage.getItem('auth_key');
};

system.redirect = function (url) {
    location.href = url;
};

system.message = {
    add: function (data) {

        var class_mark = data.this_user === true ? 'bg-darkinfo' : '';

        $('[data-context="messages_field"]').append(
            '<div class="' + class_mark + '" data-context="message_chat">' +
            '<div class="p-3" data-context="name">' +
            data.name +
            '</div>' +
            '<div class="p-3" data-context="message">' +
            data.message +
            '</div>' +
            '<div class="p-3" data-context="date">' +
            data.date +
            '</div>' +
            '</div>'
        );

        if (data.no_fade === true) {
            $('[data-context="messages_field"]').scrollTop(
                document.querySelector('[data-context="messages_field"]').scrollHeight
            );
        }
        else {
            $('[data-context="messages_field"]').fadeOut(100).fadeIn(100).scrollTop(
                document.querySelector('[data-context="messages_field"]').scrollHeight
            );
        }
    }
};

system.getTimeByUnix = function (unix_time) {

    var unix_date = new Date(unix_time),
        hours = unix_date.getHours(),
        minutes = unix_date.getMinutes(),
        second = unix_date.getSeconds();

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (second < 10) second = '0' + second;

    return hours + ':' + minutes + ':' + second;

};

