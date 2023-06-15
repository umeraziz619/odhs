const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const useRouter = require("./routes/User");
const useRouterE = require("./routes/Electrician");
app.use(cookieParser());
app.use(bodyParser.json());
require("dotenv").config();
// console.log(process.env)
app.use(cors());
app.use("/users", useRouter);
app.use("/jobs", useRouterE);
const port = process.env.PORT || 5000;
mongoose.connect(process.env.Mongoos_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("connected", () => {
  console.log("Databae is connected");
});
connection.on("error", (error) => {
  console.log("Database error", error);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
