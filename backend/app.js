const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const User = require("./models/user");
const Expense = require("./models/expense");
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

const userMiddlewear = async(req, res, next) => {
  const userId = req.get('userid');
  const user = await User.findByPk(userId);
  if (user) {
    req.userDetail = user;
  }

  next();
};

app.use(userMiddlewear);

app.use("/user", userRoute);
app.use("/expense", expenseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

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
