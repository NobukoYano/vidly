const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    genre: {
        type: genreSchema,
        required: true 
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    }
});
const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(Movie) {
    // These are data clients send, clients sends genreId not genre object
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        };
    return Joi.validate(Movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.movieSchema = movieSchema;