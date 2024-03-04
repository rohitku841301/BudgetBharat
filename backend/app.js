require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require('path')

const User = require("./models/user");
const Expense = require("./models/expense");
const expenseRoute = require("./routes/expense");
const userRoute = require("./routes/user");
const orderRoute = require("./routes/order")
const sequelize = require("./database/db");
const Order = require("./models/order");

const app = express();



app.use(morgan('combined'));
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const pathFile = path.join(__dirname, `../frontend`);
console.log(pathFile);


app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use('/order', orderRoute);

app.use((req,res,next)=>{
  console.log("urll", req.url);
  res.sendFile(path.join(__dirname, `../${req.url}`))
})


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  // .sync({force:true})
  .sync()
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running at port - http://35.171.4.218:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
