const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config');

app.use(cors());
app.use(express.json());

//connecting the mongodb database
mongoose.connect(MONGODB_URL);
mongoose.connection.on('connected', () => {
  console.log("Database connected");
});
mongoose.connection.on('error', (error) => {
  console.log("Some error occurred while connecting to MongoDB", error);
});

//importing  models 
require("./models/user_model");
require("./models/sales_model");

//importing router api's


app.use(require('./routes/user_route'));
// app.use(require('./routes/sale_route')); 

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000");
});
