(function (module, require) {
    var _ = require('underscore'),
        Promise = require('bluebird'),
        validator = require('validator'),
        FieldValidationError = require('../errors/field_validation_error');

    module.exports = function (param, value, options) {
        _.defaults(options, {
            "message":    "Field is not equals",
            "comparison": undefined
        });

        return new Promise(function (resolve, reject) {

            if (!validator.equals(value, options.comparison)) {
                reject(new FieldValidationError(param, value, options.message));
                return;
            }

            resolve(value);
        });
    };
})(module, require);
