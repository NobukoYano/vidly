const auth= require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    // });
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

// router.put('/:id', async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const result = await User.findByIdAndUpdate(req.params.id, {
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//     }, {
//         new: true,
//     });

//     if (!result) return res.status(404).send("This user could not be updated...");

//     res.send(result);

// });

// router.delete('/:id', async (req, res) => {
//     const result = await User.findByIdAndRemove(req.params.id);

//     if (!result) return res.status(404).send("This user could not be found");

//     res.send(result);

// });

module.exports = router;