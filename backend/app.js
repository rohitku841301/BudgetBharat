const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const expenseRoute = require("./routes/expense");
const userRoute = require("./routes/user");
const sequelize = require("./database/db");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRoute);
app.use("/expense", expenseRoute);

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`server is running at port - http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
