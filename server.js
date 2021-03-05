const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "/app")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/app/public/index.html"));
});

app.listen(3000, () => console.log("Gator app listening on port 3000!"));
