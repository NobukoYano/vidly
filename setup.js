const mongoose = require('mongoose');

// database: playground, if not exists, it will automatically created
mongoose.connect('mongodb://localhost/moviegenre', { useNewUrlParser: true })
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err =>  console.error('Could not connect to MongoDB...', err));

const movieSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        lowercase: true
    },
})

const MovieGenre = mongoose.model('MovieGenre', movieSchema);

async function createMovieGenre() {
    const movieGenre = new MovieGenre({
        category: 'Anime',
    });
    
    try {
        const result = await movieGenre.save();
        console.log(result);    
    }
    catch (ex) {
        // console.log(ex.message);
        for (field in ex.errors) {
            // console.log(ex.errors[field]);
            console.log(ex.errors[field].message);
        };
    }
};

createMovieGenre();