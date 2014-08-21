(function (module, require) {

    var Promise = require('bluebird'),
        validator = require('validator');

    module.exports = function (param, value) {
        return new Promise(function (resolve) {
            resolve(validator.toDate(value));
        });
    };

})(module, require);