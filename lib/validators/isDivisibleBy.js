var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

module.exports = function (param, value, options) {
    _.defaults(options, {
        "message":     "Field is not divisible by",
        "denominator": 1
    });

    return new Promise(function (resolve, reject) {

        if (!validator.isDivisibleBy(value, options.denominator)) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(value);
    });
};
