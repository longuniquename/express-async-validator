var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var numberValidator = function (param, value, options) {
    _.defaults(options, {
        "allowEmpty":  true,
        "integerOnly": false,
        "max":         null,
        "min":         null
    });

    return new Promise(function (resolve, reject) {
        if (value === undefined || value === null || value === '') {
            if (options.allowEmpty) {
                resolve(value);
                return;
            } else {
                reject(new FieldValidationError(param, value, "Field is not a number"));
                return;
            }
        }

        if (options.integerOnly && !validator.isInt(value)) {
            reject(new FieldValidationError(param, value, "Field is not integer"));
            return;
        }

        if (!validator.isFloat(value)) {
            reject(new FieldValidationError(param, value, "Field is not a number"));
            return;
        }

        if (validator.isInt(value)) {
            value = validator.toInt(value);
        } else {
            value = validator.toFloat(value);
        }

        if (options.max !== null && value > options.max) {
            reject(new FieldValidationError(param, value, "Field is too big"));
        }

        if (options.min !== null && value < options.min) {
            reject(new FieldValidationError(param, value, "Field is too small"));
        }

    });
};

module.exports = numberValidator;