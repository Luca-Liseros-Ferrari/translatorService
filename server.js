// ESM

// import express from 'express'
// import translate from 'google-translate-api-jp';
// import path from 'path';

// CJS 
const express = require("express");
const translate = require('translate-google');
const path = require("path");

let app = express();

const port = 3000;

app.use(express.static(path.join(__dirname,'public')))
app.get('/',(req, res)=>{
  res.sendFile('index.html')
})

app.get('/translate', async (req, res) => {
  const text = req.query.text;
  const target = req.query.target;

  try {
    const translation = await translate(text, { to: target });
    res.json({ translation });
  } catch (error) {
    res.status(500).json({ error: 'Translation error' });
  }
});

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});