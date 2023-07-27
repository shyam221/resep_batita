const express = require("express");
const cors = require("cors");
const ContentBasedRecommender = require('./app/algorithm/ContentBasedRecommender')
const recommender = new ContentBasedRecommender({
  minScore: 0.07,
  maxSimilarDocuments: 100
});

global.__basedir = __dirname;

const app = express();

const db = require("./app/model");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");  
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require('./app/routes/user.router')(app)
require('./app/routes/favorite.router')(app)
// require('./app/routes/spoonacular.router')(app)
require('./app/routes/resep.router')(app, recommender)
require('./app/routes/admin.router')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
