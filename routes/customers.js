const admin = require('../middleware/admin'); 
const auth= require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.find({_id: req.params.id});
    if (!customer) return res.status(404).send("This customer could not be found...");
    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
    });
    await customer.save();
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
    }, {
        new: true,
    });

    if (!result) return res.status(404).send("This customer could not be updated...");

    res.send(result);

});

router.delete('/:id', [auth, admin], async (req, res) => {
    const result = await Customer.findByIdAndRemove(req.params.id);

    if (!result) return res.status(404).send("This customer could not be found");

    res.send(result);

});

module.exports = router;