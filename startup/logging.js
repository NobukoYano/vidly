const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({
            colorize: true,
            prittyPrint: true,
        }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );
    
    process.on('uncaughtException', (ex) => {
        console.log('WE GOT AN UNCAUGHT EXCEPTION!');
        winston.error(ex.message, ex);
    })
    
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.MongoDB({
    //     db: 'mongodb://localhost/vidly',
    //     level: 'info'
    // }));
    
}