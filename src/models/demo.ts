const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  email: String,
  profile: {
    something: String,
    somethingElse: String,
  },
});
schema.index({ '$**': 'text' });

export default mongoose.model('demo', schema);
