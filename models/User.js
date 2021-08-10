//importer mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
});

//pour ne pas pouvoir s'enregistrer plus d'une fois avec la même adresse
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);