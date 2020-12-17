const bcrypt = require('bcryptjs');

let compare = (salt, hash) => {
    return bcrypt.compareSync(salt, hash)
}

let createHash = (password, num) => {
    let salt = bcrypt.genSaltSync(num);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

module.exports = { compare, createHash }

