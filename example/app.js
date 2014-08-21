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

app.all('*', function (req, res) {
    req
        .model({
            "count": {
                "rules":        {
                    "required": {
                        "message": "Count is required"
                    },
                    "isInt":    {},
                    "toInt":    {}
                },
                "source":       ["query"],
                "allowEmpty":   false,
                "defaultValue": null
            },
            "email": {
                "rules":  {
                    "isEmail": {
                        "message": "Field is not a valid email"
                    },
                    "equals":  {
                        "message":    "Email should be \"first@example.com\"",
                        "comparison": "first@example.com"
                    }
                },
                "source": ["query"]
            }
        })
        .validate()
        .then(function (model) {
            res.status(200).json(model);
        })
        .catch(function (error) {
            res.status(400).json(error);
        });
});

module.exports = app;
