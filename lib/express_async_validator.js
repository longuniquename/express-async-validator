(function (module, require) {
    var _ = require('underscore'),
        Promise = require('bluebird');

    var errors = {
        "fieldValidationError": require('./errors/field_validation_error'),
        "modelValidationError": require('./errors/model_validation_error')
    };

    var validators = {
        "toString":       require('./validators/toString'),
        "toDate":         require('./validators/toDate'),
        "toFloat":        require('./validators/toFloat'),
        "toInt":          require('./validators/toInt'),
        "toBoolean":      require('./validators/toBoolean'),
        "required":       require('./validators/required'),
        "isInt":          require('./validators/isInt'),
        "isFloat":        require('./validators/isFloat'),
        "isEmail":        require('./validators/isEmail'),
        "isURL":          require('./validators/isURL'),
        "isIP":           require('./validators/isIP'),
        "isAlpha":        require('./validators/isAlpha'),
        "isAlphanumeric": require('./validators/isAlphanumeric'),
        "isNumeric":      require('./validators/isNumeric'),
        "isHexadecimal":  require('./validators/isHexadecimal'),
        "isHexColor":     require('./validators/isHexColor'),
        "isLowercase":    require('./validators/isLowercase'),
        "isUppercase":    require('./validators/isUppercase'),
        "isDivisibleBy":  require('./validators/isDivisibleBy')
    };

    function Model(req, defs) {
        this.req = req;
        this.defs = defs;
        this.errors = {};

        _.each(this.defs, function (def, param) {

            //Set param definition object defaults
            _.defaults(def, {
                "rules":        {},
                "source":       [],
                "allowEmpty":   true,
                "defaultValue": null
            });

        }, this);

        //checks if param is empty
        this.paramIsEmpty = function (param) {
            return (this.getParam(param) === undefined || this.getParam(param) === null || this.getParam(param) === '');
        };

        //Gets param from request
        this.getParam = function (param) {
            if (this.defs[param] === undefined) {
                return undefined;
            }

            var def = this.defs[param];

            for (var i = 0; i < def.source.length; i++) {
                switch (def.source[i]) {
                    case 'query':
                        if (this.req.query[param] !== undefined)
                            return this.req.query[param];
                        break;
                    case 'body':
                        if (this.req.body[param] !== undefined)
                            return this.req.body[param];
                        break;
                    case 'params':
                        if (this.req.params[param] !== undefined)
                            return this.req.params[param];
                        break;
                }
            }
        };

        //Sets param to request
        this.setParam = function (param, value) {
            if (this.defs[param] === undefined) {
                return;
            }

            var def = this.defs[param];

            for (var i = 0; i < def.source.length; i++) {
                switch (def.source[i]) {
                    case 'query':
                        if (this.req.query[param] !== undefined)
                            this.req.query[param] = value;
                        break;
                    case 'body':
                        if (this.req.body[param] !== undefined)
                            this.req.body[param] = value;
                        break;
                    case 'params':
                        if (this.req.params[param] !== undefined)
                            this.req.params[param] = value;
                        break;
                }
            }
        };

        //Adds error to param
        this.addError = function (param, error) {
            this.errors[param] = this.errors[param] || [];
            this.errors[param].push(error);
        };

        //Validates the model
        this.validate = function () {
            var model = this;
            var paramsPromises = [];
            _.each(this.defs, function (def, param) {
                var promise;
                if (this.paramIsEmpty(param) && def.allowEmpty) {
                    promise = new Promise(function (resolve) {
                        resolve(def.defaultValue);
                    });
                } else {
                    promise = new Promise(function (resolve) {
                        resolve(model.getParam(param));
                    });
                    _.each(def.rules, function (ruleOptions, validator) {
                        promise = promise
                            .then(function (value) {
                                return (validators[validator])(param, value, ruleOptions);
                            });
                    });
                }
                promise
                    .then(function (value) {
                        model.setParam(value);
                    })
                    .catch(errors.fieldValidationError, function (error) {
                        model.addError(error.param, error.message);
                    });
                paramsPromises.push(promise);
            }, this);

            return Promise
                .all(paramsPromises)
                .finally(function () {
                    if (Object.keys(model.errors).length) {
                        return Promise.reject(new errors.modelValidationError(model.errors));
                    } else {
                        return Promise.resolve(model);
                    }
                });
        };
    }

    module.exports = function () {
        return function (req, res, next) {
            req.model = function (defs) {
                return new Model(req, defs);
            };
            return next();
        }
    };

    module.exports.errors = errors;
    module.exports.validators = validators;
})(module, require);