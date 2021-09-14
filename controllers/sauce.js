const Sauce = require('../models/Sauce');
const fs = require('fs');

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
  
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const sauceObject = req.file ?
    /* si le file existe*/
    {
     ...JSON.parse(req.body.sauce),
      imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`   
    } : /*si le file n'existe pas*/ { ...req.body}
    console.log("image",sauceObject.imageUrl);

    const filename = sauce.imageUrl.split('/images/')[1];

    fs.unlink(`images/${filename}`, () => {
      Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
      .then(() => { 
   
            res.status(201).json({message: 'Sauce updated successfully!'});
            console.log(sauceObject);
            console.log(sauceObject.imageUrl);
          })   
      .catch((error) => {res.status(400).json({ error: error});
      });
    });
  })
  .catch(error => res.status(500).json({ error }));

};


exports.likeSauce = (req, res, next) => {
Sauce.findOne({_id: req.params.id})

.then(sauce => {
    
 
console.log('test/////////');

    if(req.body.userId!=undefined && parseInt(req.body.like)!=undefined){

    const like = parseInt(req.body.like); 
    const userId = req.body.userId;
  
    

    console.log('utilisateur',userId);


    var findUserByLike = sauce.usersLiked.findIndex((x) => x == userId);
    var findUserByDislike = sauce.usersDisliked.findIndex((x) => x == userId);


          if(findUserByLike > -1 && like == 0){
            console.log('avis annulé');
            sauce.usersLiked.splice(findUserByLike, 1);    
          }else if(like === 1){  
            sauce.usersLiked.push(userId); 
          }else if(findUserByDislike > -1 && like == 0){
            console.log('avis annulé');
            sauce.usersDisliked.splice(findUserByDislike, 1);   
          } else if( like === -1){
            sauce.usersDisliked.push(userId);        
          }
        
          
    sauce.likes = sauce.usersLiked.length;  
    sauce.dislikes = sauce.usersDisliked.length;   
    //console.log(findUserByLike,'findUserByLike', findUserByDislike,'findUserByDislike'); 

   
    sauce.save()
    .then(() => { res.status(201).json({message: 'Like saved successfully!'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });
  } 
  else{
    console.log();
    res.status(400).json({ error: 'userID et like manquant'})
  }

})

.catch((error) => {res.status(404).json({ error: error});});

}


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