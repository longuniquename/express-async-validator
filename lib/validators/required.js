var _ = require('underscore'),
    Promise = require('bluebird'),
    FieldValidationError = require('../errors/field_validation_error');

var requiredValidator = function (param, value, options) {
    _.defaults(options, {
        requiredValue: undefined,
        strict:        false,
        "message":     "Field is required"
    });

    return new Promise(function (resolve, reject) {
        if (options.requiredValue !== undefined) {
            if (options.strict) {
                if (value !== options.requiredValue) {
                    reject(new FieldValidationError(param, value, options.message));
                } else {
                    resolve(value);
                }
            } else {
                if (value != options.requiredValue) {
                    reject(new FieldValidationError(param, value, options.message));
                } else {
                    resolve(value);
                }
            }
        } else {
            if (value === undefined || value === null || value == '') {
                reject(new FieldValidationError(param, value, options.message));
            } else {
                resolve(value);
            }
        }
    });
};

module.exports = requiredValidator;