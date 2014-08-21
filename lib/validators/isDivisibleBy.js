var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var divisibleByValidator = function (param, value, options) {
    _.defaults(options, {
        "allowEmpty":  true,
        "emptyValue":  null,
        "message":     "Field is not divisible by",
        "denominator": 1
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

        if (!validator.isDivisibleBy(value, options.denominator)) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(value);
    });
};

module.exports = divisibleByValidator;