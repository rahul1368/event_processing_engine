require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./authentication_module/_helpers/jwt');
const errorHandler = require('./authentication_module/_helpers/error-handler');

const test = require('./routes/test');
const {MongoClient} = require('mongodb');
const clientApiKeyValidation  = require('./common/authUtils');

const CONN_URL = 'mongodb://localhost:27017';
let mongoClient = null;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

/************************************ */

MongoClient.connect(CONN_URL,{ useNewUrlParser: true }, function (err, client) {
    mongoClient = client;
})

app.get('/test',(req,res,next)=>{
    res.json({"status":"OK"});
    next();
})

app.use((req,res,next)=>{
    req.db = mongoClient.db('test');
    next();
});

//Uncomment this to achieve api authentication
//app.use(clientApiKeyValidation);

/************************************ */

// api routes
app.use('/users', require('./authentication_module/users/users.controller'));

app.use('/test',test);
// global error handler
app.use(errorHandler);

app.use((req, res, next) => {
    if (!res.data) {
        return res.status(404).send({
            status: false,
            error: {
                reason: "Invalid Endpoint", 
                code: 404
            }
        });
    }

    res.status(res.statusCode || 200).send({ status: true, response: res.data });
})

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

process.on('exit', (code) => {
    mongoClient.close();
    console.log(`About to exit with code: ${code}`);
});


process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});

