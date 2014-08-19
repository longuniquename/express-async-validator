var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var integerValidator = function (param, value, options) {
    _.defaults(options, {
        "allowEmpty": true,
        "emptyValue": null,
        "message":    "Field is not integer"
    });

    return new Promise(function (resolve, reject) {
        if (value === undefined || value === null || value === '') {
            if (options.allowEmpty) {
                resolve(options.emptyValue);
                return;
            } else {
                reject(new FieldValidationError(param, value, options.message));
                return;
            }
        }

        if (!validator.isInt(value)) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(validator.toInt(value));
    });
};

module.exports = integerValidator;