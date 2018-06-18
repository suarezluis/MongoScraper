var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

var routes = require('./controllers/controller.js');
app.use('/', routes);

app.listen(process.env.PORT || 3001, function() {
    process.env.PORT == undefined ? console.log("App listening on PORT 3001") : console.log("App listening on PORT" + process.env.PORT);
});