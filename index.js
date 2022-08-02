require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})); //Use body-parser to Parse POST Requests

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const shortedUrl =  require('./models/shortedUrl');


//create record
//shortedUrl.createAndSaveURL("https://www.youtube.com/", 9);

app.post('/api/shorturl', (req, res) => {
  let posted_url = new URL(req.body.url);
  dns.lookup(posted_url.hostname, (err, address, family) =>{
    if(err){
      res.json({ error: 'invalid url' });
    }
    else{
      shortedUrl.findUrlByName(req.body.url)
        .then(url => {
          if(url){ //if url exist
            res.status(200).json(url);
          }
          else{
            try {
              const newUrl = req.body.url;
              shortedUrl.countAll()
              .then(newShort =>{
                shortedUrl.createAndSaveURL(newUrl, newShort);
                res.status(200).json({ original_url : newUrl, short_url : newShort});
              });
            } catch (error) {
              res.status(400).json(error);
            }
          }
        })
        .catch((error) => res.status(404).json(error));
    }
  });
});

//REDIRECTION
app.get('/api/shorturl/:short', function(req, res) {
  shortedUrl.findUrlByShortUrl(req.params.short)
    .then(url => {
      if(url){ //if url exist
        //res.status(200).json({ original_url : url.original_url, short_url : url.short_url});
        res.status(200).redirect(url.original_url);
      }else{
        res.status(404).json({error: "There are no entry of this kind!"})
      }
    })
    .catch((error) => res.status(404).json({error: error}));
});

/*
//GET ALL
app.get('/api/shorturl/all/0', function(req, res) {
  shortedUrl.findAll()
    .then(url => {
      if(url && url.length>0){ //if url exist
        res.status(200).json(url);
      }else{
        res.status(404).json("There are no entries")
      }
    })
    .catch((error) => res.status(404).json({error: error}));
});*/

//DELETE
//app.get('/api/shorturl/del', function(req, res) {
  //shortedUrl.removeByUrl("https://www.google.com/");
  //shortedUrl.removeByUrl("https://www.facebook.com/");
  //shortedUrl.removeByUrl("https://www.youtube.com/");
  //shortedUrl.removeByUrl("https://www.mongodb.com/");
  //shortedUrl.removeByUrl("https://www.facbook.com/");
  //shortedUrl.removeByUrl("https://www.google.com");
  //shortedUrl.removeByUrl("https://www.ibm.com/");
    /*.then(del => {
      console.log('Delete successfully');
      //res.status(200).json('Delete successfully ' + del);
    })
    .catch((error) => {
      console.log('Delete do not succeed ' + error);
      //res.status(200).json('Delete do not succeed ' +error);
    });
//});
*/

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

