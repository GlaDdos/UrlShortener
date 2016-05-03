var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var Bear        = require('./app/models/bear.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/UrlList');

var router = express.Router();

router.use(function(request, response, next){
  next();
});

router.route('/new')
  .get(function(request, response){
    Bear.find({}, function(err, url){
      if(err)
        throw err;
      if(url){
        response.json(url);
      }
    });
  });

router.route('/new/:fullUrl*')
  .get(function(request, response){

    var bear = new Bear();
    var postedURL = request.url.slice(5);

    if(validateURL(postedURL)){

      Bear.findOne( {'fullUrl': postedURL}, function(err, url){
        if(err)
          throw err;

        if(url){
          response.json({ shortUrl: url.shortUrl, fullUrl: url.fullUrl });
        } else {

          bear.fullUrl = postedURL;
          bear.shortUrl =  'localhost:8080/' + randomAdress(Bear);

          console.log(bear.shortUrl);

          bear.save(function(err){
            if(err){
              throw err;
            }

            response.json({ shortUrl: bear.shortUrl, fullUrl: bear.fullUrl });
          });

        }
      });


    }else {
      response.json( { error: 'INCORRECT URL...' } );
    }
  });


  router.get('/', function(request, response){
    response.sendFile(__dirname +'/public/index.html');
  });

  router.route('/:id_url')
    .get(function(request, response, next){
      Bear.findOne({ 'shortUrl': request.params.id_url}, function(err, url){
        if(err)
          throw err;

        if(url){
          response.redirect(url.fullUrl);
        }else {
          response.json({ error: 'Url does not exist'} );
        }
      });
    });



app.use('/', router);

app.listen(port);

function randomAdress(Bear){

  var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var randomUrl = '';

  for(var i = 0; i < 6; i++){
    randomUrl += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  Bear.findOne({ 'shortUrl': randomUrl }, function(err, url){
    if(err)
       throw err;

      if(url){
        console.log('recurring!')
        randomAdress(Bear);
      }else {

      }
  });

  //hazard!
  return randomUrl;
}

function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

console.log('Node server is working on ' + port);
