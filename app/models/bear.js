var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var BearSchema  = new Schema({
  fullUrl:  {type: String, unique: true},
  shortUrl: {type: String, unique: true}
});

module.exports = mongoose.model('Bear', BearSchema);
