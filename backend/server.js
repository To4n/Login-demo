const express = require("express");
const cors = require("cors");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.get("/url", (req, res, next) => {
 res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

app.listen(port, () =>{
    console.log(`server is running on port ${port}`);
});