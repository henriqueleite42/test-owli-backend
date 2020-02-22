const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

mongoose.connect(
  'mongodb+srv://'+
  process.env.DB_USER+
  ':'+process.env.DB_PASS+
  '@tests-ixu2m.gcp.mongodb.net/'+
  process.env.DB_NAME+
  '?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  }
)

module.exports = mongoose;