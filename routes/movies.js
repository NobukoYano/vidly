const admin = require('../middleware/admin'); 
const auth= require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.find({_id: req.params.id});
    if (!movie) return res.status(404).send("This movie could not be found...");
    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log('Test#1 Genre:'+Genre);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const movie = new Movie({
        genre: {
            _id: genre.id,
            name: genre.name
        },
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const result = await Movie.findByIdAndUpdate(req.params.id, {
        // not all of genre property
        genre: {
            _id: genre.id,
            name: genre.name
        },
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    }, {
        new: true,
    });

    if (!result) return res.status(404).send("This movie could not be updated...");

    res.send(result);

});

router.delete('/:id', [auth, admin], async (req, res) => {
    const result = await Movie.findByIdAndRemove(req.params.id);

    if (!result) return res.status(404).send("This movie could not be found");

    res.send(result);

});

module.exports = router;