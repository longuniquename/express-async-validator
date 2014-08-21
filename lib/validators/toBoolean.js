(function (module, require) {

    var Promise = require('bluebird'),
        validator = require('validator');

    module.exports = function (param, value, options) {
        _.defaults(options, {
            "strict": false
        });
        return new Promise(function (resolve) {
            resolve(validator.toBoolean(value, options.strict));
        });
    };

})(module, require);
