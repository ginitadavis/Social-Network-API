const { connect, connection } = require('mongoose');
require('dotenv').config();

// After you create your Heroku application, visit https://dashboard.heroku.com/apps/ select the application name and add your Atlas connection string as a Config Var
// Node will look for this environment variable and if it exists, it will use it. Otherwise, it will assume that you are running this application locally
const connectionString =
  process.env.MONGODB_URI || `mongodb+srv://ginaveradavis:${process.env.MongoDB_pass}@cluster0.hskmxxd.mongodb.net/`;

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;