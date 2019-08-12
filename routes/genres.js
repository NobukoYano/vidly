// const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); 
const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    // throw new Error('Could not get the genres');
    const genres = await Genre.find().sort('name');
    res.send(genres);    
});

router.get('/:id', validateObjectId ,async (req, res) => {
    const genre = await Genre.find({_id: req.params.id});
    if (!genre) return res.status(404).send("name not found");
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({name: req.body.name});
    await genre.save();
    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
        new: true,
    });

    if (!result) return res.status(404).send("name not found");

    res.send(result);

    /////////////////////////////////////
    // // Look up the genre
    // // If not existing, return 404
    // const genre = await Genres.find({_id: req.params.id});
    // if (!genre) return res.status(404).send("name not found");

    // // Validate
    // // If invalidate, return 400
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // // Update
    // genre.name = req.body.name;  
    // const result = await genre.save();  
    // // Return the updated genre
    // res.send(result)

});

router.delete('/:id', [auth, admin], async (req, res) => {
    const result = await Genre.findByIdAndRemove(req.params.id);

    if (!result) return res.status(404).send("name not found");

    res.send(result);

    // ///////////////////////////////////////////
    // // Look up the genre
    // // If not existing, return 404
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    // if(!genre) return res.status(404).send(`The genre ${req.params.id} was not found`);

    // // Delete
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    // Return genres
    // res.send(genres);

});

module.exports = router;