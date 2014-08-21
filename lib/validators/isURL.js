var _ = require('underscore'),
    Promise = require('bluebird'),
    validator = require('validator'),
    FieldValidationError = require('../errors/field_validation_error');

var urlValidator = function (param, value, options) {
    _.defaults(options, {
        "allowEmpty":       true,
        "emptyValue":       null,
        "message":          "Field is not URL",
        "protocols":        [ 'http', 'https', 'ftp' ],
        "requireTld":       true,
        "requireProtocol":  false,
        "allowUnderscores": false
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

        if (!validator.isURL(value, {
            "protocols":         options.protocols,
            "require_tld":       options.requireTld,
            "require_protocol":  options.requireProtocol,
            "allow_underscores": options.allowUnderscores
        })) {
            reject(new FieldValidationError(param, value, options.message));
            return;
        }

        resolve(value);
    });
};

module.exports = urlValidator;