const mongoose = require('mongoose');
const Joi = require('joi');
// const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    movie: {
        // type: movieSchema,
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255,
            }
        }),
        required: true 
    },
    customer: {
        type: customerSchema,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    }
}));

function validateRental(Rental) {
    // These are data clients send, clients sends genreId not genre object
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
    };
    return Joi.validate(Rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;