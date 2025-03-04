require(`dotenv`).config();
const express = require(`express`);
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require(`./config/db`);
const UserRoute = require(`./routes/userRoute`);
const ProductRoute = require(`./routes/productRoute`);
const CartRoute = require(`./routes/cartRoute`);


// mongo db connection
connectDB();

app.use(express.json());
// routes

app.use(`/api/auth/`, UserRoute);
 app.use(`/api/products/`, ProductRoute);
 app.use(`/api/cart/`, CartRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})