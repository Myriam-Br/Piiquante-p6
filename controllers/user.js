const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()


exports.signup = (req, res, next) => {
    const pwdRe =   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
     if(req.body.password.match(pwdRe)) {
         bcrypt.hash(req.body.password, 10)  
         
         .then(hash => {
             const user = new User({
             email: req.body.email,
             password: hash
             });
             
             user.save()
                 .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                 .catch(error => res.status(400).json({ error }));
         })
 
         .catch(error => res.status(500).json({ error }));
     } else {
        return res.status(401).send(' password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character ')
 
     }
 };


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
            //si l'utilisateur n'existe pas
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                    //si le mot de passe est incorrect
                    return res.status(401).json({ error: 'Mot de passe incorrect !' }); //401 = accès non autorisé
                    }
                    const tokenSecret = process.env.TOKEN;
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            tokenSecret,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); //notamment lié au pb de connexion
        })
        .catch(error => res.status(500).json({ error }));
};

