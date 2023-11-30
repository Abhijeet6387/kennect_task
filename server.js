const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const UserRoute = require("./routes/UserRoute");
const PostRoute = require("./routes/PostRoute");
// const path = require("path");
require("dotenv").config();
const database = process.env.DB_URI;
const port = process.env.PORT;
// const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(cors());
// middleware for parsing
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//proxy middleware
// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://localhost:4000",
//     changeOrigin: true,
//   })
// );

//Api Connection
app.get("/", (req, res) => {
  res.send("Welcome Home");
});
app.use("/users", UserRoute);
app.use("/posts", PostRoute);

//build
// app.use(express.static(path.join(__dirname, "frontend", "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
// });

//DB & server setup
mongoose.Promise = global.Promise;
mongoose.connect(
  database,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) console.log("Something Went Wrong");
    else console.log("Connected to Database");
  }
);

app.listen(port, () => {
  console.log("Server is up at port: " + port);
});
