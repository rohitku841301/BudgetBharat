const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const User = require("./models/user");
const Expense = require("./models/expense");
const expenseRoute = require("./routes/expense");
const userRoute = require("./routes/user");
const orderRoute = require("./routes/order")
const sequelize = require("./database/db");
const Order = require("./models/order");

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
app.use('/order', orderRoute);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

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
