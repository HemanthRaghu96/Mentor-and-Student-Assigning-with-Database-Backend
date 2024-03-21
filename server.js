const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const indexRouter = require("./routes/route");

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Mentor and Student Assigning with Database");
});

app.use("/", indexRouter);

app.listen(PORT, () => console.log("Server started"));