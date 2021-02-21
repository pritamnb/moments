//node modules
require('dotenv').config();
const config = require('config');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');

//custom libs
const winstonLogger = require('./server/libs/winstonLib');
const corsLib = require('./server/libs/corsLib');


//importing routes
const users = require('./server/routes/users');
const images = require('./server/routes/s3');
const moments = require('./server/routes/moments');

//loading express
const app = express();

//setting up middlewares
app.use(express.json());
app.use(body_parser.urlencoded({extended:false}));
app.use(corsLib);

//routes
app.use('/user',users);
app.use('/image',images);
app.use('/moment',moments);

//DB Connect
mongoose.connect(config.get('mongodbUrl'),{useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true})
    .then(()=>{
        winstonLogger.info("Connected To MongoDB");
    })
    .catch((error)=>{
        winstonLogger.error("Something went Wrong : "+error);  
    });

const server = http.createServer(app);

//start Server
server.listen(config.get('Port'),()=>{
    winstonLogger.info("Express server started on port "+config.get('Port'));
});

