require('dotenv').config(); //import and load .env variables

//Install and Set Up Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//DATABASE INITIALISATION
//Create a Model
let shortedUrlSchema  = new mongoose.Schema({
  original_url: { type: 'String', required: true },
  short_url: { type: 'Number', required: true }
});
const ShortedUrl = mongoose.model('ShortedUrl', shortedUrlSchema);

//Create and Save a Record of a Model
const createAndSaveURL = (original_url, short_url) => {
  let url = new ShortedUrl({
    original_url: original_url,
    short_url: short_url,
  });
  url.save()
  .then(() => console.log('Enregistrement réussie !'))
  .catch(() => console.log('Enregistrement échouée !'));
};

//find all
const findAll = async () => {
  try {
    return ShortedUrl.find();
  } catch (error) {
    console.log(`Could not find items ${error}`);
  }
};

//Count records
const countAll = async () => {
  try {
    return ShortedUrl.count();
  } catch (error) {
    console.log(`Could not count items ${error}`);
  }
};

//find by url exists
const findUrlByName = async (url) => {
  try {
    return ShortedUrl.findOne({original_url: url});
  } catch (error) {
    console.log(`Could not find item ${error}`);
  }
};
//find by short url exists
const findUrlByShortUrl = async (sh_url) => {
  try {
    return await ShortedUrl.findOne({short_url: parseInt(sh_url)})
  } catch (error) {
    console.log(`Could not find item ${error}`);
  }
};

//delete a record
const removeByUrl = async (url) => {
  try {
    return await ShortedUrl.deleteMany({original_url: url})
  } catch (error) {
    console.log(`Could not delete item ${error}`);
  }
};

exports.ShortedUrl = ShortedUrl;
exports.createAndSaveURL = createAndSaveURL;
exports.countAll = countAll;
exports.findAll = findAll;
exports.findUrlByName = findUrlByName;
exports.findUrlByShortUrl = findUrlByShortUrl;
exports.removeByUrl = removeByUrl;