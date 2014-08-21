(function (module, require) {
    var _ = require('underscore'),
        Promise = require('bluebird'),
        validator = require('validator'),
        FieldValidationError = require('../errors/field_validation_error');

    module.exports = function (param, value, options) {
        _.defaults(options, {
            "message":   "Field is not matches",
            "pattern":   null,
            "modifiers": null
        });

        return new Promise(function (resolve, reject) {

            if (!validator.matches(value, options.pattern, options.modifiers)) {
                reject(new FieldValidationError(param, value, options.message));
                return;
            }

            resolve(value);
        });
    };
})(module, require);
