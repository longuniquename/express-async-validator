var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var emailValidator = function (param, value, options) {
    _.defaults(options, {
        "message":    "Field is not email"
    });

    return new Promise(function (resolve, reject) {

        if (!validator.isEmail(value)) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(value);
    });
};

module.exports = emailValidator;