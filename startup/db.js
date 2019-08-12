const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config')

module.exports = function() {
    const db = config.get('db');
    mongoose.set('useFindAndModify', false);

    mongoose.connect(db, {
        useNewUrlParser: true,
        useFindAndModify: false,
    })
        .then(()=> winston.log('info', `Connected to ${db}...`));
        // .catch(err =>  winston.error('Could not connect to MongoDB...', err));

}