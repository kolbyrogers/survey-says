const express = require("express");
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: false }));

app.get("/path", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  // find and send
});

app.post("/path", (req, res) => {
  // use request body to create object
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
