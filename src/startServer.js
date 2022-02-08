const fs = require('fs');
const path = require('path');

const express = require('express');

const mainPage = require('./main');

const app = express();

app.use('/', mainPage);

app.listen(80, () => {
  console.log('server start on http://127.0.0.1');
})
