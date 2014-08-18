var express = require('express'),
    bodyParser = require('body-parser'),
    expressAsyncValidator = require('../lib/express_async_validator');

var app = express();
app.use(bodyParser());
app.use(expressAsyncValidator());

app.set('port', 3000);

require('http').createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

app.all('*', function (req, res, next) {
    req
        .validate({
            "limit":  {
                "rules":   {
                    "required": {
                        "message": "Limit is required"
                    },
                    "number":   {
                        "allowEmpty":  false,
                        "integerOnly": true,
                        "min":         0,
                        "max":         100
                    }
                },
                "options": {
                    "source": ["query"]
                }
            },
            "offset": {
                "rules":   {
                    "required": {
                        "message": "Offset is required"
                    }
                },
                "options": {
                    "source": ["query"]
                }
            }
        })
        .then(function (model) {
            res.status(200).json(model);
        })
        .catch(function (error) {
            res.status(400).json(error);
        });
});

module.exports = app;
