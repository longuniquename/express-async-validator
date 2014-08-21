var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var integerValidator = function (param, value, options) {
    _.defaults(options, {
        "message":    "Field is not integer"
    });

    return new Promise(function (resolve, reject) {

        if (!validator.isInt(value)) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(value);
    });
};

module.exports = integerValidator;