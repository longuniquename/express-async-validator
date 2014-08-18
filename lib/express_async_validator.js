var _ = require('underscore'),
    Promise = require('bluebird'),
    FieldValidationError = require('./errors/field_validation_error'),
    ModelValidationError = require('./errors/model_validation_error');

var validators = {
    "required": require('./validators/required'),
    "number":   require('./validators/number')
};

var expressAsyncValidator = function () {

    function getParam(req, param, source) {
        return new Promise(function (resolve, reject) {
            for (var i in source) {
                switch (source[i]) {
                    case 'query':
                        if (req.query[param] !== undefined) {
                            resolve(req.query[param]);
                        }
                        break;
                    case 'body':
                        if (req.body[param] !== undefined) {
                            resolve(req.body[param]);
                        }
                        break;
                    case 'params':
                        if (req.params[param] !== undefined) {
                            resolve(req.params[param]);
                        }
                        break;
                }
            }
            resolve(undefined);
        });
    }

    return function (req, res, next) {
        req.validate = function (defs) {
            var model = {};
            var validationErrors = {};
            var validationPromises = [];
            _.each(defs, function (def, param) {
                def.options = def.options || {};
                def.rules = def.rules || {};
                _.defaults(def.options, {
                    source: ['query']
                });

                var validationPromise = getParam(req, param, def.options.source);
                _.each(def.rules, function (ruleOptions, validator) {
                    validationPromise = validationPromise
                        .then(function (value) {
                            return (validators[validator])(param, value, ruleOptions);
                        });
                });
                validationPromise
                    .then(function (value) {
                        model[param] = value;
                    })
                    .catch(FieldValidationError, function (error) {
                        validationErrors[param] = validationErrors[param] || [];
                        validationErrors[param].push(error.message);
                    });
                validationPromises.push(validationPromise);
            }, req);

            return Promise
                .all(validationPromises)
                .finally(function () {
                    if (Object.keys(validationErrors).length) {
                        return Promise.reject(new ModelValidationError(validationErrors));
                    } else {
                        return Promise.resolve(model);
                    }
                });
        };
        return next();
    }
};

module.exports = expressAsyncValidator;
module.exports.FieldValidationError = FieldValidationError;
module.exports.ModelValidationError = ModelValidationError;