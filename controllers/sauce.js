const Sauce = require('../models/Sauce');
const fs = require('fs');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const { find } = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce = new Sauce({
   ...sauceObject,
   imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   userLiked : [],
   userDisLiked : [],
  });

  sauce.save()
    .then(() => {res.status(201).json(
      {
        message: 'Post saved successfully!'
      });
    })
    .catch((error) => {res.status(400).json({ error: error});});
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
    _id: req.params.id,
     })
    .then((sauce) => {res.status(200).json(sauce);})
    .catch((error) => {res.status(404).json({ error: error});});
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  
  /* si le file existe*/
  {
   ...JSON.parse(req.body.sauce),
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : /*si le file n'existe pas*/ { ...req.body}

  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => { res.status(201).json({message: 'Sauce updated successfully!'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });
};

exports.likeSauce = (req, res, next) => {
Sauce.findOne({_id: req.params.id})
.then(sauce => {
    const like = req.body.like; 
    const userId = req.body.userId;

    console.log(req.body.like);
    console.log(req.body.userId);
    
    console.log(sauce.usersLiked);
    console.log(sauce.usersDisliked);
    
    console.log(like);

    console.log('utilisateur',sauce.userId == userId);

    if(sauce.userId === userId && !(sauce.likes === like)){
     console.log('utilisateur existe dans le tableau');
     
 
      if(like == 1){    
        sauce.usersLiked.push(like);
        sauce.usersDisliked.splice(like);
        sauce.likes = 1;  
        sauce.dislikes = 0;    
        console.log('liked');      
      }    
  
      if(like == -1){
      console.log('disliked');
      sauce.usersDisliked.push(like);
      console.log(sauce.usersLiked);
      sauce.usersLiked.splice(like);
      sauce.dislikes = 1;
      sauce.likes = 0;    
      }
  
      if(like == 0){
        console.log('avis annulé');
        sauce.usersLiked.splice(like);
        sauce.usersDisliked.splice(like);
        sauce.likes = 0;    
        sauce.dislikes = 0;    
      } 

    }

 

    
    sauce.save()
    .then(() => { res.status(201).json({message: 'Like saved successfully!'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });

})

.catch((error) => {res.status(404).json({ error: error});});

}

/*
exports.modifySauceLike = async (req, res, next) => {
  const sauceObject = req.body.sauce;

  Sauce.updateOne({like: req.params.like}, {...sauceObject, like: req.params.like})
  .then(() => { res.status(201).json({message: 'Sauce like updated successfully!'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });
};*/

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];

      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {res.status(200).json(sauces);})
    .catch((error) => {res.status(400).json({error: error});
    });
};