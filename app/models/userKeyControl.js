const LocalStorage = require('node-localstorage').LocalStorage;
const local_storage = new LocalStorage('./local_storage');

/**
 * Установить ключ пользователю
 *
 * @param {string} name
 * @returns {string}
 */
function generate_key(name) {
    let crypto = require('crypto')
        , shasum = crypto.createHash('sha1');

    let unix = Math.floor(new Date() / 1000);

    let key = `${name}_${unix}_${Math.random() * 10000}`;
    shasum.update(key);

    let key_sha1 = shasum.digest('hex');

    return key_sha1;
}

/**
 * Установить ключ
 *
 * @param {string} key - ключ
 * @param {string} name - имя пользователя
 * @returns {boolean} - успешна установка или нет
 */
function set_key(key, name) {
    if (
        typeof key === 'string' &&
        typeof name === 'string' &&
        key.length > 0 &&
        name.length > 0
    ) {
        local_storage.setItem(key, name);
        return true;
    }
    else
        return false;
}

/**
 * Проверить существует ли ключ
 *
 * @param {string} key - ключ
 * @param {boolean} return_name - возвращать ли имя пользователя в случае успешного поиска
 * @returns {boolean} | {string}
 */
function check_key_online(key, return_name = false) {
    if (
        key in users_chat_online &&
        key in users_connections
    ) {
        let name = users_chat_online.key.name;

        if (
            name !== null &&
            typeof name === 'string'
        ) {
            return return_name ? name : true;
        }
        else
            return false;
    }
    else
        return false;

}

function valid_name(name) {
    if (
        typeof name === 'string' &&
        name.length > 0
    )
        return true;
    else
        return false;
}

function get_name_by_key(key) {

    let name = local_storage.getItem(key);

    return name != null ? name : false;
}


module.exports = {
    generate_key: generate_key,
    set_key: set_key,
    check_key_online: check_key_online,
    valid_name: valid_name,
    get_name_by_key: get_name_by_key
};