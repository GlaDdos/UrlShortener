'use strict';

module.exports = function(app){
  app.route('/')
    .get(function (request, response){
      response.send('');
      console.log('/ get route');
    });

    app.route('/api/:id')
      .get(function (request, response){
        response.send('id:' + request.params.id);
        console.log('/ api route');
      });
}


function verifyScript(urlID){
  if(urlID){
    var regex = "/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/"
  }else{
    return false;
  }
}
