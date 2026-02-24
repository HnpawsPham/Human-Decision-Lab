const express = require('express')
const path = require("path");

// initial
const app = express()
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

// run local
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on port: ', PORT)
})