// Dependencies
import mongoose from 'mongoose'

// Enable Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Database Connect
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

export default mongoose