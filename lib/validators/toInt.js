(function (module, require) {

    var Promise = require('bluebird'),
        validator = require('validator');

    module.exports = function (param, value, options) {
        _.defaults(options, {
            "radix": 10
        });
        return new Promise(function (resolve) {
            resolve(validator.toInt(value, options.radix));
        });
    };

})(module, require);
