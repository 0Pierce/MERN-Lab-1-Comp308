const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://0Pierce:Pierce0303@atlascluster.7nsnxtt.mongodb.net/MERN_COMP307?retryWrites=true&w=majority&appName=AtlasCluster"
)
  .then(() => console.log("MongoDB connected successfully to MERN_COMP307!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

module.exports = mongoose;
