const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String
  },
  countryCode: {
    type: String
  },
  lat: {
    type: String
  },
  latlong: {
    type: Object
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

export default mongoose.model('City', CitySchema);
