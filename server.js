require(`dotenv`).config();
const express = require(`express`);
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require(`./config/db`);



connectDB();


app.get(`/`,(req,res) => {
    res.json("Hello from the server ")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})