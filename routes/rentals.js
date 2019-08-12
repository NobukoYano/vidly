const auth= require('../middleware/auth');
const admin = require('../middleware/admin'); 
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-startDate');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.find({_id: req.params.id});
    if (!rental) return res.status(404).send("This rental info could not be found...");
    res.send(rental);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not available');

    let rental = new Rental({
        movie: {
            _id: movie.id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: customer,
        // rentalFee: customer.isGold
        //     ? 10
        //     : 15
    });

    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    console.log('movie.id: '+movie.id);
    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie.id }, {
            // $inc: { numberInStock: -1 }
            numberInStock: movie.numberInStock-- 
        })
        .run()
        .then((results =>{
            console.log('Done');
            console.log(results[1]);
            res.send(rental);
        }))
        .catch(function(err){
            // Everything has been rolled back.
            
            // log the error which caused the failure
            console.log(err);
            res.status(500).send('Something went wrong...');    
        });
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    const result = await Rental.findByIdAndUpdate(req.params.id, {
        movie: {
            _id: movie.id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: customer,
        rentalFee: customer.isGold
            ? 10
            : 15,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }, {
        new: true,
    });

    if (!result) return res.status(404).send("This rental info could not be updated...");

    res.send(result);

});

router.delete('/:id', [auth, admin], async (req, res) => {
    const result = await Rental.findByIdAndRemove(req.params.id);

    if (!result) return res.status(404).send("This rental info could not be found");

    res.send(result);

});

module.exports = router;