///////////// Packages /////////////
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/dp");

///////////// ENV /////////////
dotenv.config({ path: "./config/config.env" });
const api = process.env.API_URL;

///////////// CORS (مفتوح للتجربة) /////////////
app.use(cors());
app.options("*", cors());

///////////// Global Middleware /////////////
app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

///////////// Routes /////////////
const productRouter = require("./route/products");
const userRouter = require("./route/users");
const ordersRouter = require("./route/orders");
const categoryRouter = require("./route/categories");
const orderItemRouter = require("./route/order_items");

app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/order_item`, orderItemRouter);

///////////// Auth + Error Handling /////////////
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errors-handler");

app.use(authJwt());
app.use(errorHandler);

///////////// Health Check /////////////
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

///////////// Database /////////////
connectDB();



///////////// Server /////////////
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});