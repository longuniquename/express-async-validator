var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var alphanumericValidator = function (param, value, options) {
    _.defaults(options, {
        "message":    "Field is not alphanumeric"
    });

    return new Promise(function (resolve, reject) {

        if (!validator.isAlphanumeric(value)) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(value);
    });
};

module.exports = alphanumericValidator;